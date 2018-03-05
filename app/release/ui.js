/**
 * Created by zhou on 17/8/11.
 */
const Install = require('./mod/install');
const path = require('path');
const config = require('../util/index').config;
const fs = require('fs-extra');
const data = require('../util/data');
module.exports = async function (body) {
    const res = await Install(body);
    if(body.branch !== 'master') return data.setMsg('分支不对');
    const templateDir = res.data.templateDir;
    if(data.isError(res)){
        await fs.remove(templateDir);
        return data.setMsg(res.message);
    }else{
        const uiPath = path.join(config.uiDistPath,body.project.name);
        await fs.emptyDir(uiPath);
        await fs.copy(templateDir, uiPath,{overwrite: true});
        await fs.remove(templateDir);
        return data.setData(res.data);
    }
};
