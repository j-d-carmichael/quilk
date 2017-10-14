## Installing globally

Installing globally is the easiest way to use quilk:

```npm install -g quilk```

##### NB Installing globally on npm 5+:
Since the release of npm 5+ which is installed by default on node 8, the permissions have changed. As such node-sass (a dependency of quilk) cannot be installed globally without a little twaek.

See: https://docs.npmjs.com/getting-started/fixing-npm-permissions

It is slightly different on each OS but is successfully resolved on linux using option 2 from the above link.

## Installing non-globally
You can install quilk locally but you will then need to install it in every project.

```npm install --save quilk```

To run quilk from a project:

```node node_modules/quilk/bin/quilk.js d=john watch```