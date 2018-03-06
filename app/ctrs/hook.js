
/**
 * Created by zhou on 17/8/11.
 */
const doAssert = require('../release/index');
const config = require('../util/index').config;
const data = require('../util/data');
const assert = require('assert');
/*
 * {
 "object_kind": "push",
 "before": "95790bf891e76fee5e1747ab589903a6a1f80f22",
 "after": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
 "ref": "refs/heads/master",
 "checkout_sha": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
 "user_id": 4,
 "user_name": "John Smith",
 "user_email": "john@example.com",
 "user_avatar": "https://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=8://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=80",
 "project_id": 15,
 "project":{
 "name":"Diaspora",
 "description":"",
 "web_url":"http://example.com/mike/diaspora",
 "avatar_url":null,
 "git_ssh_url":"git@example.com:mike/diaspora.git",
 "git_http_url":"http://example.com/mike/diaspora.git",
 "namespace":"Mike",
 "visibility_level":0,
 "path_with_namespace":"mike/diaspora",
 "default_branch":"master",
 "homepage":"http://example.com/mike/diaspora",
 "url":"git@example.com:mike/diaspora.git",
 "ssh_url":"git@example.com:mike/diaspora.git",
 "http_url":"http://example.com/mike/diaspora.git"
 },
 "repository":{
 "name": "Diaspora",
 "url": "git@example.com:mike/diaspora.git",
 "description": "",
 "homepage": "http://example.com/mike/diaspora",
 "git_http_url":"http://example.com/mike/diaspora.git",
 "git_ssh_url":"git@example.com:mike/diaspora.git",
 "visibility_level":0
 },
 "commits": [
 {
 "id": "b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
 "message": "Update Catalan translation to e38cb41.",
 "timestamp": "2011-12-12T14:27:31+02:00",
 "url": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
 "author": {
 "name": "Jordi Mallach",
 "email": "jordi@softcatala.org"
 },
 "added": ["CHANGELOG"],
 "modified": ["app/controller/application.rb"],
 "removed": []
 },
 {
 "id": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
 "message": "fixed readme",
 "timestamp": "2012-01-03T23:36:29+02:00",
 "url": "http://example.com/mike/diaspora/commit/da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
 "author": {
 "name": "GitLab dev user",
 "email": "gitlabdev@dv6700.(none)"
 },
 "added": ["CHANGELOG"],
 "modified": ["app/controller/application.rb"],
 "removed": []
 }
 ],
 "total_commits_count": 4
 }


 //
 {
 "object_kind": "tag_push",
 "before": "0000000000000000000000000000000000000000",
 "after": "82b3d5ae55f7080f1e6022629cdb57bfae7cccc7",
 "ref": "refs/tags/v1.0.0",
 "checkout_sha": "82b3d5ae55f7080f1e6022629cdb57bfae7cccc7",
 "user_id": 1,
 "user_name": "John Smith",
 "user_avatar": "https://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=8://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=80",
 "project_id": 1,
 "project":{
 "name":"Example",
 "description":"",
 "web_url":"http://example.com/jsmith/example",
 "avatar_url":null,
 "git_ssh_url":"git@example.com:jsmith/example.git",
 "git_http_url":"http://example.com/jsmith/example.git",
 "namespace":"Jsmith",
 "visibility_level":0,
 "path_with_namespace":"jsmith/example",
 "default_branch":"master",
 "homepage":"http://example.com/jsmith/example",
 "url":"git@example.com:jsmith/example.git",
 "ssh_url":"git@example.com:jsmith/example.git",
 "http_url":"http://example.com/jsmith/example.git"
 },
 "repository":{
 "name": "Example",
 "url": "ssh://git@example.com/jsmith/example.git",
 "description": "",
 "homepage": "http://example.com/jsmith/example",
 "git_http_url":"http://example.com/jsmith/example.git",
 "git_ssh_url":"git@example.com:jsmith/example.git",
 "visibility_level":0
 },
 "commits": [],
 "total_commits_count": 0
 }
 *
 * */
const getTypeRelease = (project = {})=>{
    const name = project.namespace+'/'+project.name;
    const obj = {
        ui: /^ui\//g,
        cdn: /^(h5|web|m)\//g,
        nodeSever: /^(node|nodeserver)\//g
    };
    let type = 'shell';
    for (const key in obj){
        if(obj[key].test(name)){
            type = key;
            break;
        }
    }
    return type
};

const Hook = {
    async index (ctx){
        let body = ctx.request.body || {};
        const query = ctx.query || {};
        const isGitHub = !!body.payload;
        if(isGitHub){
            body = JSON.parse(body.payload);
            const repository = body.repository || {};
            body.project = repository;
            body.project.namespace = repository.full_name.replace(/[\\\/]+[\s\S]*$/g,'');
            body.project.git_http_url = repository.clone_url;
            body.project.ssh_http_url = repository.ssh_url;
            body.object_kind = ctx.request.headers['x-github-event'];
        }else{
            assert (ctx.request.headers['x-gitlab-token'] === config.webHookToken,'token不对');
        }
        body.branch = body.ref.replace(/^refs[\\\/]+heads[\\\/]+/,'');
        body.env = 'dev';
        if(!/^(master|((dev|pre|release)[\\\/]+\d\.\d\.\d)$)/.test(body.branch)){
            return ctx.body = data.setMsg('分支不对')
        }
        const type = query.type || getTypeRelease(body.project);
        if(body.object_kind === 'push'){
            let res =  doAssert[type] ? await doAssert[type](body,query,ctx) : data.setMsg('type类型不支持');
            ctx.body = res;
        }else{
            ctx.body = data.setMsg('类型不支持')
        }
    }
};
module.exports = Hook;