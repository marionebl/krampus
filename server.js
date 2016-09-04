const net = require('net')
const getPort = require('get-port')
const pid = process.pid

getPort()
  .then(port => {
    const server = net.createServer()
    server.listen(port, () => {
      send({port, pid, type: 'start'})

      process.on('SIGTERM', () => {
        send({port, pid, type: 'stop'})
      })
    })
  })

function send (message) {
  if (!process.send) {
    return
  }
  process.send(message)
}
