You can configure a release object to post the quilk output to a url... aka a webhook. Just provide the url and opening message and you are good to go.
EG:
```
   ...
    "error" : [{
        "name" : "Pinging slack",
        "module" : "webhook",
        "message_start" : "Error building 007 server, here are the quilk logs",
        "url" : "https://hooks.slack.com/services/11111111/000000000/000000000003"
      }]
   ...   
```

If you need to pass any basic auth credential to the webhook you will need to add an additional 2 params, EG:
```
   ...
    "error" : [{
        "name" : "Pinging secret service",
        "module" : "webhook",
        "message_start" : "Error building 007 server, here are the quilk logs",
        "url" : "https://hooks.secret.com/services/11111111/000000000/000000000003",
        "auth_username": "bob",
        "auth_password": "has a secure password"
      }]
   ...   
```