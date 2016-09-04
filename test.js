const childProcess = require('child_process')
const test = require('ava')
const execa = require('execa')
const expect = require('unexpected')
const getPort = require('get-port')
const range = require('range').range

const krampus = require('./index.js')
const pkg = require('./package')

test('krampus', async () => {
  const s = await server()
  const results = await krampus(s.port)

  expect(results[0], 'to be', s.port)
  expect(results[1], 'to be', s.pid)

  const killed = await Promise.race([
    wait(10, false),
    s.killed()
  ])

  expect(killed, 'to be true')
})

test('krampus cli without port', t => {
  const result = execa.sync(`${__dirname}/cli.js`)
  const stdout = result.output.join('')

  expect(result.status, 'not to be', 0)
  expect(stdout, 'to contain', 'Requires at least one input [port]')
  expect(stdout, 'to contain', `${pkg.description}`) // help
})

test('krampus -h', t => {
  const result = execa.sync(`${__dirname}/cli.js`, ['-h'])
  const stdout = result.output.join('')

  expect(result.status, 'to be', 0)
  expect(stdout, 'to contain', `${pkg.description}`)
})

test('krampus --help', t => {
  const result = execa.sync(`${__dirname}/cli.js`, ['--help'])
  const stdout = result.output.join('')

  expect(result.status, 'to be', 0)
  expect(stdout, 'to contain', `${pkg.description}`)
})

test('krampus -v', t => {
  const result = execa.sync(`${__dirname}/cli.js`, ['-v'])
  const stdout = result.output.join('')

  expect(result.status, 'to be', 0)
  expect(stdout, 'to contain', `${pkg.version}`)
})

test('krampus --version', t => {
  const result = execa.sync(`${__dirname}/cli.js`, ['--version'])
  const stdout = result.output.join('')

  expect(result.status, 'to be', 0)
  expect(stdout, 'to contain', `${pkg.version}`)
})

test('krampus cli with non-numbers', t => {
  const result = execa.sync(`${__dirname}/cli.js`, ['foo'])
  const stdout = result.output.join('')

  expect(result.status, 'not to be', 0)
  expect(stdout, 'to contain', 'Requires at least one input [port]')
  expect(stdout, 'to contain', `${pkg.description}`) // help
})

test('krampus cli with non-occupied port', async t => {
  const port = await getPort()
  const result = execa.sync(`${__dirname}/cli.js`, [port])
  const stdout = result.output.join('')

  expect(result.status, 'to be', 0)
  expect(stdout, 'to contain', `No processes found for port ${port}`)
  expect(stdout, 'not to contain', `${pkg.description}`) // no help
})

test('krampus cli with multiple non-occupied port', async t => {
  const ports = await Promise.all(range(0, 4).map(getPort))
  const result = execa.sync(`${__dirname}/cli.js`, ports)
  const stdout = result.output.join('')

  expect(result.status, 'to be', 0)
  expect(stdout, 'to contain', `No processes found for ports ${ports.join(', ')}`)
  expect(stdout, 'not to contain', `${pkg.description}`) // no help
})

test('krampus cli occupied and non-occupied port', async t => {
  const s = await server()
  const port = await getPort()
  const result = execa.sync(`${__dirname}/cli.js`, [s.port, port])
  const stdout = result.output.join('')

  expect(result.status, 'to be', 0)
  expect(stdout, 'to contain', `Killed processes ${s.pid}`)
  expect(stdout, 'not to contain', `No processes found`)
  expect(stdout, 'not to contain', `${pkg.description}`) // no help
})

function wait (timeout, value) {
  return new Promise(resolve => setTimeout(() => resolve(value), timeout))
}

function server () {
  return new Promise((resolve, reject) => {
    const child = childProcess.fork(`${__dirname}/server.js`)

    const onStop = function () {
      return new Promise((resolve, reject) => {
        if (child.killed) {
          return resolve(true)
        }
        child.on('exit', message => {
          resolve(true)
        })
      })
    }

    const onStart = function (data) {
      if (data.type === 'start') {
        data.killed = onStop
        resolve(data)
      }
    }

    child.on('message', onStart)
  })
}
