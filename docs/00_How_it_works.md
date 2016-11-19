Quilk works by taking the project relevant settings and data from a quilk.json file and feeding that said data into prebuilt modules. These said modules come packaged with quilk and do all the basic things you might expect, for example compiling .scss files or finding then concatenating javascript files etc.

When you start quilk, the runner simply loops and runs each module it finds in the modules array in the quilk.json one by one until exhaustion.

The base modules quilk comes with handle the majority of tasks required to compile and build modern day web applications and the quilk.json can be configured in a matter of minutes. However, should you require something that is outside the std modules then you can simply write your own.