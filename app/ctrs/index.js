
/**
 * Created by zhou on 17/8/11.
 */
const serveIndex = require('koa2-serve-index');
const config = require('../util/index').config;
const uiServer = serveIndex(config.uiDistPath,{});
const cdnServer = serveIndex(config.cdnDistPath,{});
const send = require('koa-send');
const path = require('path');
const Ctr = {
    async index (ctx){
        ctx.body = 'hello world ars1';
    },
    async cdn (ctx,next){
        const cpath = ctx.path;
        const file = cpath.replace(/^[\\\/]+cdn(([\\\/]+)|$)/,path.sep) || path.sep;
        ctx.path = file;
        await cdnServer(ctx,next);
        ctx.path = cpath;
        await send(ctx,file,{root: config.cdnDistPath});
    },
    async ui (ctx,next){
        const cpath = ctx.path;
        const file = cpath.replace(/^[\\\/]+ui(([\\\/]+)|$)+/,path.sep) || path.sep;
        ctx.path = file;
        await uiServer(ctx,next);
        ctx.path = cpath;
        await send(ctx,file,{root: config.uiDistPath});
    }
};
module.exports = Ctr;
