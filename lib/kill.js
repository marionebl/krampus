var os = require('os');
var shell = require('shelljs');

function kill(pid, next) {
  if (os.platform() === 'win32') {
    return next('Windows is not supported yet.');
  }

  shell.exec('kill ' + pid, { silent: true }, function(code, output){
    if (code !== 0) {
      return next('Error while killing process with pid ' + pid);
    }

    next(null, pid);
  });

}

module.exports = kill;
