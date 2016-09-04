#!/usr/bin/env node
'use strict'
const stdin = require('get-stdin')
const meow = require('meow')
const num = require('is-number')
const krampus = require('./')

const cli = meow(`
    Usage
      ❯ krampus <port> ...

    Options
      -h, --help  Print this help

    Examples
      ❯ krampus 1337
      Killed process with pid 1

      ❯ krampus 1337
      No process occupying port 1337 found

      ❯ echo '1337 1338' | krampus
      Killed processes with pid 1, 2
  `, {
    alias: {
      h: ['help'],
      v: ['version']
    }
  })

// Start the program
main(cli.input)
  .then(targets => {
    const killeds = targets.filter(target => target.length > 1)
    if (!killeds.length) {
      const portName = targets.length > 1 ? 'ports' : 'port'
      const ports = targets.map(target => target[0]).join(', ')
      console.log(`No processes found for ${portName} ${ports}`)
      return
    }
    const pids = killeds.map(killed => killed[1]).join(', ')
    console.log(`Killed processes ${pids}`)
  })
  .catch(error => {
    if (error.managed) {
      console.error(error.message)
      return cli.showHelp(1)
    }
    setTimeout(() => { throw error })
  })

// Main program entry
// (args:[]) => Promise<pids:[]>
function main (args) {
  return input(args, true)
    .then(ports => {
      if (!ports.length) {
        throw error('Requires at least one input [port]', true)
      }
      const jobs = ports.map(port => krampus(port))
      return Promise.all(jobs)
    })
}

// Parse cli input or stream to pid list
// (args:[]|String, stream:bool = true) => Promise<pids:[]>
function input (args, stream) {
  const list = Array.isArray(args) ? args : args.split(' ').filter(Boolean)
  const ports = list.map(Number).filter(num)

  if (ports.length || !stream) {
    return Promise.resolve(ports)
  }

  return stdin().then(s => input(s, false))
}

function error (message, managed) {
  const error = new Error(message)
  error.managed = managed
  return error
}
