Custom modules allow you to basically do anything you want with whatever you want. Currently there is no bundled modules in quilk with babelfy for example. If this is something you would want, a custom module is what you need... but you get the idea.

There are two types of custom modules available to use:
1.  A 3rd party npm package installed to you project in the usual node_modules folder, included in the package.json file as a dependency. 
2.  Your own project custom module kept in a specific folder within your project titled `quilk_modules`.

For a module to work with the quilk runner you just need to expose a function called `run`. If you are writing a 3rd party module for others to use then the main file of the npm package should export an object with a `run` function at the top level. For example if the main file of your 3rd party npm package was `index.js` then this would have to contain something like this (the module would look exactly the same if it was a custom project module in the `quilk_modules` of your project):
```
module.export = { 
    run: function( next ){ 
        /* the codey good stuff */ 
            //put some good ingredients here please
        /* when done call next */
        next();
    } 
};
``` 
Obviously this run function can do all the donkey work of the module of can just be a gateway to something bigger and more complex, you decide.

Here is a list of all the goodies you have access to in a module
1.  **global.current_module**: This will be the current module object in the quilk.json. There is no required format, but see the example kitchen sink below for a starter. This is basially where you chunk in your project specific data. A little tip, if your module will write a file to disk, if you put this in the json as the `target` then the runner will automatically create the folders for you (checkout the kitchen sink json and note how they all have a `target` path).
1.  **global.desktopNotify**: This function accepts 2 params, a title and message body. It will be actioned if the users notifications are turned on in the quilk.json file.
1.  **global.chokidarFileChangePath**: If you are running quilk with watch then the current file that was changed will be in this variable. Handy for knowing when to skip the current module.. eg the less_std doesn't waste time building the less file if no less file was not altered.
1.  **global.cliArgs**: All the command line arguments are stored here, if you want your module to pivot by cli args then this is where to look.    
1.  **next**: The one and only argument that will be passed to each module is a callback. This will be the next module to be run after the current has finished. This is quite similar to expressJS's next functions in middlewares.
    
To create an example custom module run from the cli at the root of your project:
```
quilk init example_module
```

Example custom module in the quilk.json. To call a custom quilk module, if the module is a 3rd party from npm just enter the :
```
{
  "modules" : [
    {
      "name": "My module running",
      "module" : "my_module",
      "path_input": "/private/path/",
      "path_output": "/public/path/"
    },
    ... rest of the modules array
```  

Here is a simple 3rd party quilk module I built as an example:  https://www.npmjs.com/package/quilk-public-example-3rd-party-module

Add it to the package.json of your project, and include `quilk-public-example-3rd-party-module` in your quilk.json module array eg:
```
{
  "modules" : [
    {
      "name": "test 3rd party",
      "module": "quilk-public-example-3rd-party-module"
    },
    ...
```

If you take a look at the code in `quilk-public-example-3rd-party-module` you will see it requires a module that is not part of the quilk npm package.. yet it still works without a hitch... this has only just been tested on npm 3.10.3. This may or may not break in npm < 3...  