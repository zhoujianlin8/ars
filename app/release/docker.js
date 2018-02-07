/**
 * Created by zhou on 18/2/7.
 */
/**
 * Created by zhou on 17/8/11.
 */
const Install = require('./mod/install');
const path = require('path');
const config = require('../util/index').config;
const fs = require('fs-extra');
const data = require('../util/data');
const docker = {
    create: async ()=>{

    },
    upload: async()=>{

    },
    release: async ()=>{

    }
}
module.exports = async function (body) {
    const res = await Install(body);
    const templateDir = res.data.templateDir;
    const branch = body.branch;
    if(data.isError(res)){
        await fs.remove(templateDir);
        return data.setMsg(res.message);
    }else{
        await docker.create();
        await docker.upload();
        await docker.release();
        return data.setData(res.data);
    }
};

