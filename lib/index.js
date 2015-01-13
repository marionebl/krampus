var find = require('./find');
var kill = require('./kill');
var help = require('./help');

function krampus(port, callback) {
  find(port, function(err, pid){
    if (typeof port !== 'number') {
      return help(callback);
    }

    if (err) {
      return callback(err);
    }

    kill(pid, function(err, killed){
      if (err) {
        return callback(err);
      }

      return callback(err, killed);
    });
  });
}

module.exports = krampus;
