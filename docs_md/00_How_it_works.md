Quilk works by taking the project relevant settings and data from a quilk.json or quilk.js file and feeding that said data into prebuilt modules. These said modules come packaged with quilk and do all the basic things you might expect, for example compiling .scss files or finding then concatenating javascript files etc.

When you start quilk, the runner simply loops and runs each module it finds in the modules array in the quilk.json one by one until exhaustion.

The base modules quilk comes with handle the majority of tasks required to compile and build modern day web applications and the quilk.json can be configured in a matter of minutes. However, should you require something that is outside the std modules then you can simply write your own.

Out of the box quilk can:

* Compile **SASS** with node-sass, either by **finding scss** files or by giving it simple entry point.
* Compile **LESS** (no find module was written for LESS files).
* Generate a single CSS file from a **fixed list of CSS** files.
* **Concat** big client side js from a fixed list or instruct quilk to **find** js files in a folder.
* **Babelify** your code (requires you to install locally your preferred preset).
* **Rsync** files locally to a development server, ideal for ensuring each dev has the same environment, and saves so much time!
* **Obfusicate, minify** javascript or css using the **node-minify** module.
* **Strip out** comments from js code.
* Configure **independent** blocks for developers.
* **Desktop notifications** on or off or on for varying levels.
* Ping messages via **email** when a built has finished, with success or not.
* Ping messages via **webhooks** when a build was successful or a giant failure. 
* **Watch** a local fileset with the watch flag (**chokidar** under the hood), just tell quilk to not watch the built files with the don't watch directive.
