# SessionAlarm

## About

It often happens that the developer does not update the page of the site he is working on, and after the expiration of time this leads to a logout due to "inactivity". On some (especially old) sites, this can be quite painful, and even just annoying. This class allows you to solve this problem, without having to edit the configuration responsible for the session lifetime.

## How to use

Include the script with CDN:

```js
<script src="https://cdn.jsdelivr.net/gh/YakutD/SessionAlarm/SessionAlarm.min.js"></script>
```

Create an instance of the **SessionAlarm** class and call the initialization function:

```js
<script>
    var sessionAlarm = new **SessionAlarm**;
    sessionAlarm.init(5);
</script>
```

The class can work in two modes: page reload (default mode) and ajax request.

### Methods:

- **init**(*seconds*, [*options*]) - initializing method, the only public method at the time of **SessionAlarm** instance creation. A second call will completely reset and cancel all previously set reloads / ajax requests. Prints a warning to the console when called, mentioning the enabled mode.
     - *seconds* (Number) - number of seconds before reloading/ajax request.
     - *options* (Object) - allows you to select the **SessionAlarm** mode, make a reminder about the upcoming reboot or call a confirmation window. Possible properties:
         - *remind* (Number) - the number of seconds before a warning about an upcoming reboot is displayed in the console. The argument must be **LESSER** than *seconds*.
         - *confirm* (Boolean) - display a confirmation window before rebooting. The window is an HTML dialog element with three buttons: Confirm, Restart and Cancel.
         - *ajax* (Object) - the presence of this property automatically determines the mode of operation of **SessionAlarm** as ajax requests, *remind* and *confirm* are ignored in this case.
             - *url* (String) - required property that defines the URL for the upcoming ajax request.
             - *method* (String) - optional property that defines the method for the upcoming ajax request. The default is *GET*.
- **restart**() - becomes available after a successful call to **init**. A method that restarts the countdown until the reload/ajax request. Prints a warning to the console when called.
- **cancel**() - becomes available after a successful call to **init**. The method cancels the previously set reload/ajax request. Prints a warning to the console when called.

### Examples:

```js
<script>
    var sessionAlarm = new SessionAlarm;
    sessionAlarm.init(5); // Reload in 5 seconds
    sessionAlarm.init(5, {remind: 3, confirm: true}); // Reload after 5 seconds, with a warning after 3 and a confirmation window
    sessionAlarm.init(5, {ajax: {url: '/', method: 'POST'}}); // POST request (ajax) to index page after 5 seconds instead of reload
</script>
```

## Note

If a file with the **SessionAlarm** class is included, you will always see the corresponding warning in the console, even if the **init** method has not been called.

