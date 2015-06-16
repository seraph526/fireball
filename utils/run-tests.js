var Path = require('path');
var Fs = require('fire-fs');
var Chalk = require('chalk');
var SpawnSync = require('child_process').spawnSync;

var exePath = '';
var cwd = process.cwd();

if ( process.platform === 'darwin' ) {
    exePath = Path.join(cwd, 'bin/electron/Electron.app/Contents/MacOS/Electron');
}
else {
    exePath = Path.join(cwd, 'bin/electron/Electron.exe');
}

var files;
var testDirs = [
    Path.join( cwd, './test/' ),
    Path.join( cwd, './editor-framework/test/' ),
    Path.join( cwd, './dashboard/test/' ),
];
var singleTestFile = process.argv[2];

// accept
if (singleTestFile) {
    if (Fs.isDirSync(singleTestFile)) { //if test a folder
        if( Path.basename(singleTestFile) === 'test' ) {
            singleTestFile = Path.join(singleTestFile, 'index.js');
        } else {
            singleTestFile = Path.join(singleTestFile, 'test', 'index.js');
        }
        var indexFile = Path.join(cwd, singleTestFile);
        if ( Fs.existsSync(indexFile) ) {
            var files = require(indexFile);
            var filesMap = files.map(function(file) {
                return Path.join( Path.dirname(indexFile), file );
            });
            var fileListStr = filesMap.join(',');
            // files.forEach(function ( file ) {
            //     // var testfile = Path.join( Path.dirname(indexFile), file );
            //     console.log( Chalk.magenta( 'Start test (' + file + ')') );
            //     SpawnSync(exePath, [cwd, '--test', file], {stdio: 'inherit'});
            // });
            SpawnSync(exePath, [cwd, '--test-list', fileListStr], {stdio: 'inherit'});
        }
        else {
            console.error('Can not find index.js in %s', path);
        }
    } else {
        if ( Path.basename(singleTestFile) === 'index.js' ) {
            indexFile = Path.join(cwd, singleTestFile);
            var files = require(indexFile);
            var filesMap = files.map(function(file) {
                return Path.join( Path.dirname(indexFile), file );
            });
            var fileListStr = filesMap.join(',');
            // files.forEach(function ( file ) {
            //     // var testfile = Path.join( Path.dirname(indexFile), file );
            //     console.log( Chalk.magenta( 'Start test (' + file + ')') );
            //     SpawnSync(exePath, [cwd, '--test', file], {stdio: 'inherit'});
            // });
            SpawnSync(exePath, [cwd, '--test-list', fileListStr], {stdio: 'inherit'});
        } else {
            singleTestFile = (singleTestFile + '.js').replace('.js.js', '.js');
            SpawnSync(exePath, [cwd, '--test', singleTestFile], {stdio: 'inherit'});
        }
    }
}
else {
    var fileList = [];
    testDirs.forEach( function ( path ) {
        if ( !Fs.existsSync(path) ) {
            console.error( 'Path not found %s', path );
            return;
        }

        var indexFile = Path.join( path, 'index.js' );
        if ( Fs.existsSync(indexFile) ) {
            var files = require(indexFile);
            var filesMap = files.map(function(file) {
              var finalPath = Path.join( Path.dirname(indexFile), file );
              return finalPath;
            });
            fileList = fileList.concat(filesMap);
            // files.forEach(function ( file ) {
            //   // console.log(file);
            //     console.log( Chalk.magenta( 'Start test (' + file + ')') );
            //     SpawnSync(exePath, [cwd, '--test', file], {stdio: 'inherit'});
            // });
        }
        else {
            console.error('Can not find index.js in %s', path);
        }
    });
    var fileListStr = fileList.join(',');
    SpawnSync(exePath, [cwd, '--test-list', fileListStr], {stdio: 'inherit'});
}
