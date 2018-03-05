
/**
 * Created by zhou on 18/2/5.
 */
const config = require('../../util/index').config;
const path = require('path');
const git = require('simple-git/promise');
const fs = require('fs-extra');
const data = require('../../util/data')();
module.exports = async function (body) {
    const project = body.project || {};
    const branch = body.branch;
    const templateDir = path.join(config.gitTemplatePath,project.namespace+'_'+project.name+'_'+branch.replace(/[\\\/]/g,'_'))+'_'+ new Date().getTime();
    data.data ={templateDir};
    try{
        await fs.ensureDir(templateDir);
        await fs.emptyDir(templateDir);
        await git(templateDir).clone(project.git_http_url,templateDir,{'-b':branch});
    }catch (e){
        data.msg = e.stderr || e;
    }
    return data.Data;
};