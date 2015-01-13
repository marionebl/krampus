var os = require('os');
var shell = require('shelljs');

function find(port, next) {
  if (os.platform() === 'win32') {
    return next('Windows is not supported yet.');
  }

  shell.exec('lsof -i:' + port + ' -t', { silent: true }, function(code, output){
    if (code !== 0) {
      if (code === 1 && output === '') {
        return next('No process found occupying port ' + port);
      }
      return next('Error while trying to find process occupying port ' + port);
    }

    next(null, +output);
  });
}

module.exports = find;
