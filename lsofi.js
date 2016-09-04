const os = require('os')
const childProcess = require('child_process')
const num = require('is-number')
const through2 = require('through2')

module.exports = lsofi

const isWindows = os.platform() === 'win32'

// port:Number => Promise<results[Number, Number]>
function lsofi (port) {
  const command = isWindows
    ? ['netstat.exe', '-a', '-n', '-o']
    : ['lsof', `-i:${port}`]

  const columns = isWindows
    ? [null, 'remote', 'local', null, 'pid']
    : [null, 'pid', null, null, null, null, null, null, null]

  const transform = collate(columns, {port})
  const parser = through2.obj(function (chunk, enc, cb) {
    transform.call(this, chunk, cb)
  })

  return new Promise((resolve, reject) => {
    parser.on('data', chunk => {
      const pid = chunk.pid && Number(chunk.pid)
      if (num(pid)) {
        resolve(pid)
      }
      resolve(null)
    }) // bail as soon as possible
    parser.on('end', chunk => resolve(null)) // nothing found
    parser.on('error', error => reject(error)) // burp

    const child = childProcess.spawn(command[0], command.slice(1))

    child.stdout
      .pipe(breaklines()) // break buffer chunks into lines
      .pipe(breakwords()) // break line strings into words
      .pipe(parser)
  })
}

// => Stream<line:String>
function breaklines () {
  return through2.obj(function (chunk, _, cb) {
    String(chunk)
      .split('\n')
      .filter(Boolean)
      .forEach(line => this.push(line))
    cb()
  })
}

// => Stream<words:[String]>
function breakwords () {
  return through2.obj(function (chunk, _, cb) {
    const words = chunk.split(' ')
      .map(i => i.trim())
      .filter(Boolean)
      .filter(i => i !== '(LISTEN)') // ugh.
    this.push(words)
    cb()
  })
}

// columns:[String] => words:[String], cb:Function => entry{pid: Number|Null}>
function collate (columns) {
  return function (words, cb) {
    const entry = columns.reduce((entry, column, index) => {
      if (column === null) {
        return entry
      }

      if (words[index].toLowerCase() === column.toLowerCase()) {
        return entry
      }

      const amend = {}
      amend[column] = words[index]
      return Object.assign(entry || {}, amend)
    }, {})

    if (Object.keys(entry).length > 0) {
      this.push(entry)
    }
    cb()
  }
}
