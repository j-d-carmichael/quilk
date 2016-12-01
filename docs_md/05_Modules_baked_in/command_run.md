**command_run**
Accepts a program and an array of arguments and exectures them using nodejs child-process spawn.


**An example quilk.json block**
```
    {
      "name": "running bower install",
      "module": "command_run",
      "program": "bower",
      "arguments": ["install", "s"]
    },
```    