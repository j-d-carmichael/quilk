![](https://img.shields.io/npm/v/quilk.svg) ![](https://img.shields.io/npm/dt/quilk.svg)

#quilk
Est. 4th Sept. 2016

---

Quilk build files are constant throughout all projects and take minutes to setup.

In brief, quilk is a lightweight abstracted module runner that will compile sass, less, babelify, browserify files. Concat big client side application js or css. Obfusicate, minify javascript or sqwish css. Ping messages via email or webhooks when a build was successful or a giant failure. Offset your developers working environments to a standardized server for the ultimate team collaboration setup. Use quilk to compile client side code for multiple environments.

To ensure things remain constant between your companies projects, the build file is a standard JSON file.

*A lot more under the hood, check the documentation page for more.*

---

### Full quilk documentation here 
[https://johnc1984.github.io/quilk/](https://johnc1984.github.io/quilk/)

---

*If anyone fancies helping [evolve](https://github.com/johnc1984/quilk/) quilk give me a shout, many [skilled] hands make light work.*


### Last commit
1 - The quilk runner no longer halts the entire build process, instead calls the module next in the queue. It does instead only console in big red writing something went wrong.

2 - Fixed an annoying bug, you can now change the quilk json file while the watcher is watching without having to restart quilk.