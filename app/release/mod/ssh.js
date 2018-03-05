/**
 * Created by zhou on 18/2/8.
 */
const ssh = require('ssh2');
const request = require('request');
const fs = require('fs');
const util = require('../../util/index');
const conn = async (option)=>{
    return new Promise((resolve,reject)=>{
        const Client = ssh.Client;
        const conn2 = new Client();
        conn2.on('ready',function () {
            resolve(conn2);
        }).on('error',function (err) {
            reject(err);
        }).connect(option)
    })
};
const download = async (uri,filename,)=>{
    const stream = fs.createWriteStream(filename);
    return new Promise((reslove)=>{
        request(uri).pipe(stream).on('close', reslove);
    })
};

const execOneShell = async(option) =>{
    const con = await conn(option.ssh);
    let shellFile = option.shellFile;

    if (/^(http(s)?\:)?\/\//g.test(shellFile)) {

        await download(shellFile,util.getCachePath())
    }
    const remoteFile = option.remotePath || shellFile;
    return new Promise((resolve,reject)=>{
        con.sftp(function(err, sftp) {
            if(err){return reject(err)}
            sftp.fastPut(shellFile, remoteFile ,function(err,res) {
                if(err){return reject(err)}
                con.exec(`bash ${remoteFile} && rm -rf ${remoteFile}`,function (err,res) {
                    con.end();
                    resolve(res)
                })
            });
        });
    });

};

const doArrayAsync = async(arrs,done)=>{
    let reslut = [];
    const doIt = async function (arr){
        if(!arr.length) return;
        const option = arr.pop();
        try{
            reslut.push(await done(option));
        }catch (err){
            reslut.push(err);
        }
        await doIt(arr);
    };
    await doIt(arrs);
    return reslut;
};

const execShell = async(option)=>{
    if(Array.isArray(option.ssh)){
        let reslut = [];
        option.ssh.forEach((item)=>{
            let opt = Object.assign({},option);
            opt.ssh = item;
            reslut.push(opt)
        });
        return await doArrayAsync(reslut,execOneShell);
    }else{
        return await execOneShell(option)
    }
};
exports.execOneShell =  execOneShell;
exports.execShell =  execShell;
exports.conn = conn;
exports.ssh = ssh;
