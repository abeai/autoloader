/* eslint-disable global-require */
'use strict';
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = {
    jsfiles: _jsfiles,
};

function _jsfiles(filename) {

    var autoLoad = {};

    var moduleFiles = fs.readdirSync(
        path.dirname(
            fs.realpathSync(filename)
        )
    );

    // eslint-disable-next-line
    function notIndexOrUnderscoreAndJsOrDir(t) {

        if (
            fs.statSync(path.join(path.dirname(filename), t)).isDirectory()
            && !t.match(/^_.*/)
            && !t.match(/^lib$/)
        ) {
            return true;
        }

        if (
            t === 'index.js'
            || t.match(/^_.*/)
            || !t.match(/.*\.js(on)?$/)
        ) {
            return false;
        }

        return true;
    }

    function requireMapFunction(t) {
        autoLoad[t.replace(/\.js(on)?$/, '')] = require(path.join(path.dirname(filename), t));
    }

    _.map(
        _.filter(moduleFiles, notIndexOrUnderscoreAndJsOrDir),
        requireMapFunction
    );

    return autoLoad;

}
