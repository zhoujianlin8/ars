
/**
 * Created by zhou on 17/7/31.
 */
const Ctr = require('./ctrs/index');
const Hook = require('./ctrs/hook');
const koaBody = require('koa-body');

module.exports = function (app) {
    app.get('/',Ctr.index);
    app.post('/webhook.json',koaBody(),Hook.index);
    //提供cdn访问
    app.get(['/cdn/**','/cdn'],Ctr.cdn);
    //提供ui访问
    app.get(['/ui/**','/ui'],Ctr.ui);

};
