var semver = require('semver');
var fs = require('fs');
var path = require('path');
var format = require('util').format;

module.exports = function assertVersion(files, jsonPath) {
    var file;
    var version;
    var defaultRegExp = /"version":\s*"([^"]+)/; // For `*.json` files.
    var defaultRegExp2 = /\/\*\![\s\S]+(v?\d+\.\d+\.\d+)/; // For other files.

    jsonPath = jsonPath || 'package.json';

    try {
        version = JSON.parse(fs.readFileSync(jsonPath, {encoding: 'utf8'})).version;
    } catch(e) {}

    if (!((version = semver.valid(version)))) {
        return format('Invalid version in `%s`', jsonPath);
    }

    for (file in files) {
        var checkers = files[file],
            checker,
            contents,
            ver;

        try {
            contents = fs.readFileSync(file, {encoding: 'utf8'});
        } catch(e) {
            return format('Failed to read `%s`', file);
        }

        if (!(checkers instanceof Array)) {
            checkers = [checkers];
        }

        for (var i = 0; i < checkers.length; i++) {
            checker = checkers[i] || (path.extname(file) === '.json' ? defaultRegExp : defaultRegExp2);

            if (typeof checker === 'function') {
                ver = checker(contents);

                if (typeof ver !== 'string') {
                    return format('Version extractor result for `%s` is not a string', file);
                }
            } else {
                if (!(checker instanceof RegExp)) {
                    checker = new RegExp(checker);
                }

                ver = contents.match(checker);

                if (!ver || !((ver = ver[1]))) {
                    return format('Failed to find version in `%s` with %s regular expression', file, checker);
                }
            }

            if (ver !== version) {
                return format('Version mismatch (`%s` !== `%s` in `%s`)', ver, version, file);
            }
        }
    }
};
