You can make use of the email module to send out an email message, add include_log as true and then all the console log output will be captured in full html syntax with colour. 

Here is an example of using a predefined email config block that will be triggered as the last module run in the live release array:
```
  ...
  "release_commands_or_modules": {
    "live":{
      "post":[{
        "name": "Email total output",
        "module": "email",
        "config": "dev",
        "email_subject": "Logs from quilk build on live",
        "email_message": "The quilk build for live has just finished, below the log output.",
        "include_log": true
      }]
    },
    ...
```

Note in the email the config section with the string 'main', this refers to a global email block eg:
  ```
  "email": {
    "main": {
      "email_to" : ["devs@some-email.net"],
      "email_from" : {
        "name": "quilk",
        "email": "john@gmail.com"
      },
      "transport_options": {
        "environment_variables": false,
        "host": "smtp.gmail.com",
        "port": 465,
        "secure": true,
        "auth": {
          "user": "john@gmail.com",
          "pass": "password"
        }
      }
    }
  }
  ```

You can set as many blocks into this area as you want. As quilk might be building on a dev server, a testing server and a production server and you may not want to be sending emails with the same details. Just give each block a different name and refer to them in wherever you use the email module.