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
    const templateDir = res.data.templateDir;
    if(data.isError(res)){
        await fs.remove(templateDir);
        return data.setMsg(res.message);
    }else{
        await fs.copy(path.join(templateDir, 'build'), path.join(config.cdnDistPath,body.project.name),{overwrite: true});
        await fs.remove(templateDir);
        return data.setData(res.data);
    }
};

