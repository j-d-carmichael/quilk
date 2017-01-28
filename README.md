![](https://img.shields.io/npm/v/quilk.svg) ![](https://img.shields.io/npm/dt/quilk.svg)

#quilk
Est. 4th Sept. 2016

---

Quilk is a developer tool to build your project from a standardised JSON file.

In brief, quilk is a lightweight abstracted module runner that will compile SASS, find SASS files automatically, LESS, babelify, browserify files. Concat big client side application js & find. Generate CSS from a fixed list. Obfusicate, minify javascript or sqwish css. Ping messages via email or webhooks when a build was successful or a giant failure. Offset your developers working environments to a standardized server for the ultimate team collaboration setup. Use quilk to compile client side code for multiple environments.

To ensure things remain constant between your companies projects, the build file is a standard JSON file. There is of course the ability to write your own modules for quilk, either publicy hosted of privately nested in your project repo.

*A lot more under the hood, check the documentation page for more.*

---

### Full quilk documentation here 
[https://jdcrecur.github.io/quilk/](https://jdcrecur.github.io/quilk/)

---

*If anyone fancies helping [evolve](https://github.com/jdcrecur/quilk/) quilk give me a shout, many [skilled] hands make light work.*


### Last commit
1 - Rework of the sass_find module. Works with in-memory files opposed to temporary physical files. As an exmaple, a project with 67 .scss files with a total output .css file size of approx 300Kb uncompressed with outputStyle as expanded, the total build time with an SSD is 104ms / 110ms with verbose loggin turned on. [https://jdcrecur.github.io/quilk/Modules_baked_in/sass_find.html](https://jdcrecur.github.io/quilk/Modules_baked_in/sass_find.html)