var through = require('through2'),
    gutil = require('gulp-util'),
    path = require('path'),
    Jsonator = require('jsonator'),
    PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-jsonator';

/**
 * Transform JSON schemas to default objects.
 * @returns {*}
 */
function gulpJsonator(extension) {
    extension = extension || '.defaults.json';
    var stream = through.obj(function(file, enc, cb) {
        var self = this;
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }

        if (file.isBuffer()) {
            var obj = JSON.parse(file.contents.toString());
            var defaultObj = new Jsonator(obj).generateObjectForSchema();
            file.contents = new Buffer(JSON.stringify(defaultObj, null, 2));
            file.path = gutil.replaceExtension(file.path, extension);
            self.push(file);
            cb();
        }
    });

    return stream;
};

module.exports = gulpJsonator;