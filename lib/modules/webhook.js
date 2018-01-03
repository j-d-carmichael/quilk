var request = require('request'),
    toolbox = require('../toolbox')

var self = {

  run: function (next) {

    if (!require('../onlyModuleCheck')('webhook')) return next()

    //the request options
    var options = {
      method: 'post',
      json  : self.buildPostObject(),
      url   : global.current_module.url
    }

    global.log.general('Webhook starting: ' + global.current_module.url)

    var request_cb = function (err, response, body) {
      if (err) {
        global.log.error('Webhook failed')
        global.log.general(err)
        return next()
      }
      else {
        global.log.general('Webhook completed with the following repsonse body: ')
        global.log.general(body)
        if (next) {
          next()
        }
      }
    }

    if (global.current_module.auth_username) {
      request(options, request_cb).auth(global.current_module.auth_username, global.current_module.auth_password, false)
    }
    else {
      request(options, request_cb)
    }
  },

  /**
   * Reads the module data to build the request object and return.
   * @returns {{}}
   */
  buildPostObject: function () {
    var p = {}

    if (global.current_module.message_start) {
      p.text = global.current_module.message_start + '\n\n'
    }
    else {
      p.text = '*Quilk logs:*\n\n'
    }

    if (global.current_module.include_logs) {
      var logs = global.log.returnCache()
      for (var i = 0; i < logs.length; ++i) {
        try {
          p.text += toolbox.striptags(convert.toHtml(logs[i])) + '\n'
        }
        catch (e) {
          p.text += toolbox.striptags(logs[i]) + '\n'
        }
      }
    }

    return p
  }
}

module.exports = self