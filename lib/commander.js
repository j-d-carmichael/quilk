import commandLineArgs from 'command-line-args'

return commandLineArgs([
  { name: 'developer', alias: 'd', type: String },
  { name: 'release', alias: 'r', type: String },
  { name: 'sync_all', type: String },
  { name: 'dryRun', type: String },
  { name: 'rsyncPull', type: String },
  { name: 'example_module', type: String },
  { name: 'input', alias: 'i', type: String },
], {
  stopAtFirstUnknown: true
})