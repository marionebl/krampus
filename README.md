# krampus [![stability][0]][1]

> `krampu:s` - :smiling_imp: Kill processes occupying a port

![krampus usage](./krampus.gif)

[![npm version][6]][7] [![Travis branch][2]][3] [![AppVeyor branch][4]][5]

* :rocket: dead simple
* :earth_africa: cross platform
* :santa: christmas-themed german name

## Installation

Grab it from npm

* `npm install -g krampus`

## Usage

```
❯ krampus -h

  Kill processes occupying a port

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
```

---
krampus is built by [marionebl](https://github.com/marionebl) and [contributors](https://github.com/marionebl/krampus/graphs/contributors). It is released unter the [MIT](https://github.com/marionebl/krampus/blob/master/LICENSE) license.

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/travis/marionebl/krampus/master.svg?style=flat-square
[3]: https://travis-ci.org/marionebl/krampus
[4]: https://img.shields.io/appveyor/ci/marionebl/krampus/master.svg?style=flat-square
[5]: https://ci.appveyor.com/project/marionebl/krampus
[6]: https://img.shields.io/npm/v/krampus.svg?style=flat-square
[7]: https://npmjs.org/package/krampus
