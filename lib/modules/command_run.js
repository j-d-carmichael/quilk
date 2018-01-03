var fs = require('fs'),
  path = require('path'),
  spawn = require('child_process').spawn,
  clc = require('cli-color')

module.exports = {
  run: function (next) {

    if (!require('../onlyModuleCheck')('command_run')) return next()

    var command = spawn(global.current_module.program, global.current_module.arguments || [])

    command.stdout.on('data', function (data) {
      global.log.general(' ' + data)
    })

    command.stderr.on('data', function (data) {
      global.log.general(clc.bold.red('Error:'))
      global.log.general(' ' + data)
    })

    command.on('close', function (code) {
      global.log.general(global.current_module.program + ' finished with code ' + code)
      next()
    })
  }
}
