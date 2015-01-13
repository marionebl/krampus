var fs = require('fs');
var path = require('path');

function help(callback) {
  fs.readFile(path.resolve(__dirname, '../README.md'), function(err, contents){
    if (err) return callback(err);
    callback('\n' + contents.toString('utf-8'));
  });
}

module.exports = help;
