# assert-version

Check if version mentions match the one from package.json


## Install

`npm install -g assert-version`


## How matches work

Version could be extracted with regular expression or, if you use
`assert-version` as Node.js module, with user-defined function.

In case of regular expression, version should present in first capture.

There are two default regular expressions. If your file has `.json` extension,
`/"version":\s*"([^"]+)/` expression is used. Otherwise,
`/\/\*\![\s\S]+(v?\d+\.\d+\.\d+)/` expression is used. I understand that these
expressions are not great, they just seem to work for my cases. Feel free to
send improvements.


## Use as Node.js module

```js
assertVersion = require('assert-version');

var error = assertVersion({
    'bower.json': '', // First default regular expression will be used.
    'mylib.js': '', // Second default regular expression will be used.
    'other.js': /version=([^,]+)/,
    'other2.js': function(contents) {
        // `contents` is a file contents, function should return version as
        // string.
        return contents.substring(100500, 100510);
    },
    'other3.js': [matcher1, matcher2] // If you need to check more than one place in file.
});

// `error` will have error message in case of error, `undefined` otherwise.
```

Optionally, you can pass path to `package.json` with reference version as
second argument of `assertVersion()`. It is `package.json` from current
working directory by default.


## Use as command line tool

Same to previous example (except for function extractor):

```
assert-version -f bower.json -f mylib.js -f other.js='version=([^,]+)' -f other3.js=matcher1 -f other3.js=matcher2
```


## Example (Gulp task)

Example from https://github.com/hoho/conkitty-route/blob/master/gulpfile.js.

```js
gulp.task('assert-version', function(err) {
    var assertVersion = require('assert-version');

    err(assertVersion({
        'croute.js': '',
        'bower.json': ''
    }));
});

```


## Example (Grunt task)

Example from https://github.com/hoho/concat.js/blob/master/Gruntfile.js.

```js
grunt.registerTask('assert-version', function() {
    var assertVersion = require('assert-version'),
        error;

    error = assertVersion({
        'concat.js': '',
        'bower.json': ''
    });

    if (error) {
        grunt.log.error(error);
        return false;
    }
});
```
