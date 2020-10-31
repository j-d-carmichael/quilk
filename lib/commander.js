const { Command } = require('commander')
const packageJson = require('../package.json')
const program = new Command()

program
  .option('-d, --developer', 'The developer block to use in the quilk file')
  .option('-r, --release', 'The release block to use in the quilk file')
  .option('--sync_all', 'When present and rsync module used, this will force a full sync, ignoring the ignore list')
  .option('--dryRun', 'When present and rsync module used, this will run rsync with --dry-run flag')
  .option('--rsyncPull', 'When present and rsync module used, this will reverse the rsync target and source order which can then pull opposed to push code')
  .option('--example_module', 'Inject the example module into the quilk file on init')
  .option('-i, --input', 'The name of the input file, defaults to quilk.js(on). This will permit multiple quilk files in 1 repo, eg "quilk.main.js"')

program.version(packageJson.version)

program.parse(process.argv)

return program