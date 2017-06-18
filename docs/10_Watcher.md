### Dont Watch

When using the watch option ensure that you instruct which file to not watch, `dont_watch`.

The `dont_watch` option is quilk.json is passed to chokidar as directories and exact files to not trigger on. EG should you build a css file from sass you don't want to trigger chokidar to run all the modules again when it spots a change in the said css file ie ending up in an infinite loop.


### Chokidar Controls
The watcher is essentially an abstraction to [Chokidar](https://www.npmjs.com/package/chokidar), as with most other built in modules in quilk you are able to pass in native options to control the watcher.

Add this block to your quilk file, see [Chokidar](https://www.npmjs.com/package/chokidar) for all options available:
```
chokidar_options: {
    atomic: 50,
    followSymlinks: true,
    depth: 120
}
```

### Race conditions with other watchers

You can at times hit races conditions with other watchers, for example using Laravel's Mix with quilk's rsync. To help reduces the multi trigger of the quilk modules there is a default wait time of 500 ms between triggers.

This default time can be changed with the `watcher_wait_between_changes` directive in your quilk file to any integer of milli-seconds:
```
chokidar_options: 100
```