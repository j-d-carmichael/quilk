var clc = require('cli-color')

module.exports = {
  run: function (next) {

    if (!require('../onlyModuleCheck')('just_for_fun')) return next()

    global.desktopNotify('This is just for fun.', 'Enjoy', 10)

    global.log.general(clc.bold('Hi there!') + 'This is the sample module.')
    global.log.general('')
    global.log.general('I do not actually do anything except console log stuff.')
    global.log.general('')
    global.log.general('You see me being used in the quilk.json modules array')

    if (global.current_module.print_this) {
      global.log.general('')
      global.log.general('My only dynamic job is to print what is in the "print_this" section from my bit of the quilk.json')
      global.log.general(global.current_module.print_this)
    }

    //run the next module
    next()
  }
}