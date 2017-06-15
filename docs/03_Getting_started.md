First up... I don't enjoy typing dashes before cli args, if you do that is fine they will still work but, the quilk cli commands also work without, eg the following all map to the same thing.. help: 
```
quilk help
``` 
```
quilk -help
``` 
```
quilk --help
```

### Generating a new quilk.json or quilk.js file
Decide if you want your quilk config delivered via a json file or js file via module.exports.
[See here for more on choosing json or modules](https://jdcrecur.github.io/quilk/JSON-or-Module.html)

The `quilk.js(on)` is, as you might have already guessed, where all the quilk magic is configured. Create your base `quilk.json` file by running from the root of your project (or copying from another project):
```
 quilk init
```

### What is in the generated quilk.json
The generated quilk.json file is configured to run the `just_for_fun` module.

You can take quilk for a test drive by typing `quilk`, this will take the developer in the quilk.json named default and pass to the modules the quilk.json is configured to run, which in this case is just the fun run module.

### Single build
With your quilk.json configured you can kick off a single run with:
```
quilk
```

### Watch your project and auto-rebuild
Adding `watch`into the mix will instruct quilk to watch your files and re-run the modules in the modules array again after a change (either a new file or change or removal). The watcher is chokidar:
```
quilk watch
```

### Build for a particular environment
In the quilk.json you will see a `release_commands_or_modules` section. Here you can add commands or modules to be run, note the pre and post section, this just means things run before the usual modules array or after. EG you may wish to run a bower install on an environment before running the std modules array, when completing you will likely wish to minify and compress the js and css files.
```
quilk release=live
```