/**
 * Created by zhou on 18/2/9.
 */
const ssh = require('../app/release/mod/ssh');
const path = require('path');
ssh.execShell({
    shellFile: 'http://fefamily.cn/',
    remotePath: '/home/test.sh',
    ssh: {
        host: '118.31.69.185',
        //port: 22,
        username: 'root',
        password: 'Zhou1991'
    }
});
/*
ssh.execShell({
    shellFile: path.join(__dirname,'test.sh'),
    remotePath: '/home/test.sh',
    ssh: {
        host: '118.31.69.185',
        //port: 22,
        username: 'root',
        password: 'Zhou1991'
    }
});*/
