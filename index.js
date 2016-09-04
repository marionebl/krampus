const lsofi = require('./lsofi')
const num = require('is-number')

module.exports = krampus

// Kill a process given it occupies a port
// port:Number => result:Promise<{port:Number, pid:Number:null, killed:null}>
function krampus (port) {
  if (!num(port)) {
    return Promise.reject('port must be a number')
  }

  return lsofi(port)
    .then(pid => {
      if (pid === null) {
        return [port]
      }
      process.kill(pid)
      return [port, pid]
    })
}
