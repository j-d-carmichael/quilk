**Dont watch** 

When using the watch option ensure that you instruct which file to not watch, `dont_watch`.

The `dont_watch` option is quilk.json is passed to chokidar as directories and exact files to not trigger on. EG should you build a css file from sass you don't want to trigger chokidar to run all the modules again when it spots a change in the said css file ie ending up in an infinite loop.

The watcher is essentially an abstraction to [Chokidar](https://www.npmjs.com/package/chokidar), as with most other built in modules in quilk you are able to pass in native options to control the watcher.


Add this block to your quilk file, see [Chokidar](https://www.npmjs.com/package/chokidar) for all options available:
```
chokidar_options: {
    atomic: 50,
    followSymlinks: true,
    depth: 120
}
```
