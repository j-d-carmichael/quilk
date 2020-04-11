const versionCheck = require('npm-tool-version-check').default

const thisVersion = require('./package.json').version // Update this to work for your package
const remoteJson = 'https://raw.githubusercontent.com/johndcarmichael/quilk/master/package.json' // Update this URL to work for your package
const packageName = 'quilk' // Update this to your package name

console.log('Current quilk version: ' + thisVersion)
versionCheck(thisVersion, remoteJson, packageName)
  .then(() => {
    require('./lib/quilk')
  })
  .catch(() => {
    process.exit(0)
  })
