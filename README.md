# Toggler
 Javascript library to create a toggler, with callback functions

Example usage:
```javascript
const toggler = new Toggler("toggler-container", {
    "buttons": {
        "light": ["/svg/sun.svg", () => {
            // Code to execute when the button is clicked
        }],
        "dark": ["/svg/moon.svg", () => {
            // Code to execute when the button is clicked
        }]
    },
    "initial": "light",
})
```

Some more examples are available in the `examples` folder, which can also be viewed by going to index.html in the root directory and clicking on the links.