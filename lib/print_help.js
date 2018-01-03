var clc      = require('cli-color'),
    jsonfile = require('jsonfile'),
    log      = require('./log');

module.exports = function(){
  log.general( clc.bold('Please visit: ') + clc.bold.underline('https://jdcrecur.github.io/quilk/How_it_works.html')  );
};