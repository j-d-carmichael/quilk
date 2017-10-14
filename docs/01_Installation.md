## Installing globally

Installing globally is the easiest way to use quilk:

```npm install -g quilk```

##### NB Installing globally on npm 5+:
Since the release of npm 5+ which is installed by default on node 8, the permissions have changed. As such node-sass (a dependency of quilk) cannot be installed globally.

There are two options to fix this issue:
1.  Use [NVM](https://github.com/creationix/nvm). This is by far the best option and recommended, NVM is generally a great tool for managing node versions on your machine and bypassing permission issues. 
1.  or Change the location of where npm install global packages See: https://docs.npmjs.com/getting-started/fixing-npm-permissions Although this is advertised by npm, this is not totally reliable and you may run into similar permission issues.

## Installing non-globally
You can install quilk locally but you will then need to install it in every project.

```npm install --save quilk```

To run quilk from a project:

```node node_modules/quilk/bin/quilk.js d=john watch```