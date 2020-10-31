require('colors')
const { Command } = require('commander')
const packageJson = require('../package.json')
const program = new Command()

try {
  program
    .option('-d, --developer', 'The developer block to use in the quilk file')
    .option('-w, --watch', 'Watch the code base for changes')
    .option('-r, --release', 'The release block to use in the quilk file')
    .option('--sync_all', 'When present and rsync module used, this will force a full sync, ignoring the ignore list')
    .option('--dryRun', 'When present and rsync module used, this will run rsync with --dry-run flag')
    .option('--rsyncPull', 'When present and rsync module used, this will reverse the rsync target and source order which can then pull opposed to push code')
    .option('--example_module', 'Inject the example module into the quilk file on init')
    .option('-i, --input <path>', 'The name of the input file, defaults to quilk.js(on). This will permit multiple quilk files in 1 repo, eg "quilk.main.js"')

  program.version(packageJson.version)
  program.exitOverride()
  program.parse(process.argv)
  program.rawArgs.forEach((a) => {
    if (['d', 'w', 'r'].includes(a)) {
      console.error('quilk command line args now use commander, please preface all options with - or --, eg --watch instead of just watch'.red.bold)
      console.log('You just passed in: ' + a)
      console.log('Try again with: -' + a)
      process.exit()
    }
    if (['developer', 'watch', 'release'].includes(a)) {
      console.error('quilk command line args now use commander, please preface all options with - or --, eg --watch instead of just watch'.red.bold)
      console.log('You just passed in: ' + a)
      console.log('Try again with: --' + a)
      process.exit()
    }
  })
} catch (e) {
  if (!program.help && !program.version) {
    console.log('Available options are:')
    program.options.forEach((option) => {
      console.log(option.flags)
      console.log(option.description)
      console.log('')
    })
  }
  process.exit()
}

module.exports = program