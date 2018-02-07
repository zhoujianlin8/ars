/**
 * Created by zhou on 18/2/5.
 */
const cdn = require('./cdn');
const ui =  require('./ui');
const nodeSever = require('./node-server');
const shell = require('./sh');
const docker = require('./docker');
module.exports = {
    cdn,ui,nodeSever,shell,docker,
};