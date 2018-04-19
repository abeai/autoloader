/* eslint-disable global-require */
'use strict';
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = {
    jsfiles: _jsfiles,
};

/**
  * @typedef {Object} options
  * @property {Object} initObject If set, will execute required file with initObject as param
  * @property {Boolean} [includeUnderscore=false] Include _underscore files/folders
  * @property {Boolean} [ignoreDirectories=false] Ignore directories
  * @example <caption>Example of options</caption>
  * {
  *      initObject: {
  *          someKey: "SOME_VALUE",
  *          someOtherKey: "SOME_OTHER_VALUE",
  *      },
  *      includeUnderscore: true,
  *      ignoreDirectories: true,
  * }
  */

function _jsfiles(indexFile, options) {

    var autoLoad = {};

    var moduleFiles = fs.readdirSync(
        path.dirname(
            fs.realpathSync(indexFile)
        )
    );

    // eslint-disable-next-line
    function notIndexOrUnderscoreAndJsOrDir(fileToLoad) {

        if (
            fs.statSync(path.join(path.dirname(indexFile), fileToLoad)).isDirectory()
            && !_.get(options, 'ignoreDirectories')
            && (_.get(options, 'includeUnderscore') || !fileToLoad.match(/^_.*/))
            && !fileToLoad.match(/^lib$/)
        ) {
            return true;
        }

        if (
            fileToLoad === 'index.js'
            || !_.get(options, 'includeUnderscore') && fileToLoad.match(/^_.*/)
            || !fileToLoad.match(/.*\.js(on)?$/)
        ) {
            return false;
        }

        return true;
    }

    function requireMapFunction(fileToLoad) {
        if (
            !_.get(options, 'initObject')
            || fs.statSync(path.join(path.dirname(indexFile), fileToLoad)).isDirectory()
        ) {
            return autoLoad[fileToLoad.replace(/\.js(on)?$/, '')]
                = require(path.join(path.dirname(indexFile), fileToLoad));
        }
        return autoLoad[fileToLoad.replace(/\.js(on)?$/, '')]
            = require(path.join(path.dirname(indexFile), fileToLoad))(options.initObject);
    }

    _.map(
        _.filter(moduleFiles, notIndexOrUnderscoreAndJsOrDir),
        requireMapFunction
    );

    return autoLoad;

}
