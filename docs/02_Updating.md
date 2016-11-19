The most reliable way to update most NPM globally installed packages is just just to install them again..

```npm install -g quilk```

After an update on node you may also completely remove quilk first before updating

1.  `npm uninstall -g quilk`
1.  Double check that the quilk module has been completely removed by checking the npm nod_modules folder. Discover where the directory is with `npm root -g`, if the quilk directory is still there.. `rm -R quilk`.
