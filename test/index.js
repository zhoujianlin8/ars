/**
 * Created by zhou on 18/2/9.
 */
const ssh = require('../app/release/mod/ssh');
const path = require('path');
const crypto = require('crypto');
const bufferEq = require('buffer-equal-constant-time');
const code = '111111';
function sign (data) {
    return 'sha1=' + crypto.createHmac('sha1',code).update(data).digest('hex')
}
function verify(signature,data) {
    return bufferEq(Buffer.from(signature), Buffer.from(sign(data)))
}

verify('',{

})

//console.log('sha1=' + crypto.createHmac('sha1', code).update(code).digest('hex'));

/*ssh.execShell({
    shellFile: 'http://fefamily.cn/',
    remotePath: '/home/test.sh',
    ssh: {
        host: '118.31.69.185',
        //port: 22,
        username: 'root',
        password: 'Zhou1991'
    }
});*/
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
