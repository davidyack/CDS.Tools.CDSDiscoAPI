The nodejs library for calling the Dynamics 365 Discovery Service is in it's early stages of development.  It is functional and you can use it, just be aware it may change with feedback. 

Example calling to retrieve all instances available to the user

```javascript
        api.GetInstances().then(function (results) {

            console.log(results);

        }, function (error) { console.log(error); });
```
