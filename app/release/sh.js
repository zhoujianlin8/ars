/**
 * Created by zhou on 17/8/11.
 */
const ssh = require('./mod/ssh');
const path = require('path');
const config = require('../util/index').config;
const data = require('../util/data');
module.exports = async function (body) {
    const res = await ssh.execShell({
        shellFile: body.shellFile,
        remotePath: body.remotePath,
        ssh: body.ssh
    });
    return data.setData(res);

};

