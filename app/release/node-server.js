/**
 * Created by zhou on 17/8/11.
 */
const Install = require('./mod/install');
const path = require('path');
const config = require('../util/index').config;
const fs = require('fs-extra');
const data = require('../util/data');
const promisify = require('util.promisify');
const spawn = promisify(require('cross-spawn-async').spawn);
module.exports = async function (body) {
    const res = await Install(body);
    const templateDir = res.data.templateDir;
    if(data.isError(res)){
        await fs.remove(templateDir);
        return data.setMsg(res.message);
    }else{
        if(await fs.pathExists(path.join(templateDir,'package.json'))){
            try{
                await spawn('npm',['install','--production'],{cwd: templateDir})
            }catch (e){
                await fs.remove(templateDir);
                return data.setMsg(e)
            }
        }
        const serverPath = path.join(config.nodeServerDistPath,body.project.name);
        const options =  {cwd: serverPath,env: {NODE_ENV: body.env}};
        if(await fs.pathExists(serverPath)){
            try{
                await spawn('npm',['run','stop'],options)
            }catch(e){
            }
        }
        await fs.emptyDir(serverPath);
        await fs.copy(templateDir, serverPath,{overwrite: true});
        await fs.remove(templateDir);
        spawn('npm',['run','start'],options);
        return data.setData(res.data);
    }
};

