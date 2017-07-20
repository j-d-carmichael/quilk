**Copy Module**

This module does as you might expect, it copies files from location to another. This is helpful for publishing fonts or other assets pulled from a dep manager such as compoer or node into your public folder, eg in Laravel the public folder.

The module only needs an input and output:

```
  { name: 'Copy the fonts to the build folder',
    module: 'copy',
    source: '/vendor/maximebf/debugbar/src/DebugBar/Resources',
    target: '/public/build/debug-bar/' },
```

There is an additional flag you can add `dontRunOnRelease`, this will stop the module from running on a release.
This is helpful for when you want to publish some client resource in dev only, eg a php debug bar.

```
  { name: 'Copy the fonts to the build folder',
    module: 'copy',
    dontRunOnRelease: true,
    source: '/vendor/maximebf/debugbar/src/DebugBar/Resources',
    target: '/public/build/debug-bar/' },
```