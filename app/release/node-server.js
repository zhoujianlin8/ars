/**
 * Created by zhou on 17/8/11.
 */
const Install = require('./mod/install');
const path = require('path');
const config = require('../util/index').config;
const fs = require('fs-extra');
const data = require('../util/data');
const spawn = require('@exponent/spawn-async');
module.exports = async function (body) {
    const res = await Install(body);
    const templateDir = res.data.templateDir;
    let error = false;
    if(data.isError(res)){
        await fs.remove(templateDir);
        return data.setMsg(res.message);
    }else{
        if(await fs.pathExists(path.join(templateDir,'package.json'))){
            const packageLock = path.join(templateDir,'package-lock.json');
            //删除会影响下载
            if(await fs.pathExists(packageLock)){
                await fs.remove(packageLock)
            }
            try{
                await spawn('npm',['install','--production'],{cwd: templateDir})
            }catch (e){
                error = e.stderr || e;
            }
            if(error){
                await fs.remove(templateDir);
                return data.setMsg(error)
            }
        }

        const serverPath = path.join(config.nodeServerDistPath,body.project.name);
        const options =  {cwd: serverPath,env: Object.assign(process.env,{NODE_ENV: body.env})};
        const isArs = body.project.name === 'ars';
        const isDebugger = body.isDebug === 1;
        //如果是自身
        try{
            await fs.emptyDir(serverPath);
            await fs.copy(templateDir, serverPath,{overwrite: true});
            await fs.remove(templateDir);
        }catch (e){}
        if(await fs.pathExists(path.join(serverPath,'package.json'))){
            if(isArs){
                try{
                    spawn('npm',['run','restart']);
                }catch (e){
                    return data.setMsg('重启失败')
                }
                return data.setData(res.data);
            }
            try{
                await spawn('npm',['run','stop'],options);
            }catch(e){
            }
            try{
                await spawn('npm',['run',isDebugger ? 'debug' : 'start'],options);
            }catch (e){}
        }else {
            return data.setMsg('package.json不存在')
        }
        return data.setData(res.data);
    }
};


