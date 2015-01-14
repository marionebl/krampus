var os = require('os');
var shell = require('shelljs');

function kill(pid, next) {
  var processName = 'process';
  var pidName = 'pid';

  if (os.platform() === 'win32') {
    return next('Windows is not supported yet.');
  }

  if (Array.isArray(pid)) {
    pid = pid.join(' ');
    processName = 'processes';
    pidName = 'pids';
  }

  shell.exec('kill ' + pid, { silent: true }, function(code, output){
    if (code !== 0) {
      return next('Error while killing ' + processName + ' with ' + pidName + ' ' + pid);
    }

    next(null, pid);
  });

}

module.exports = kill;
