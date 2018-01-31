/* jshint -W097 */
// jshint strict:true
/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

var stdInStream;

stdInStream = process.stdin;

var stop = false;

stdInStream.on('data', function (data) {
    if (data.length > 0) {
        console.log('ADD NEW DATA (' + data.length + ')');
    }
    console.log('PAUSE');
    stdInStream.pause();
    setTimeout(function() {
        console.log('RESUME');
        stdInStream.resume();
    }, 2000);
});

stdInStream.on('error', function (msg) {
    console.log('STDIN ERROR: ' + msg);
});

stdInStream.on('end', function () {
    console.log('STDIN END');
    stop=true;
    process.exit();
});
