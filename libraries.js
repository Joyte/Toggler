function setCookie(n, v, d) {
    var e = "";
    if (d) {
        var t = new Date();
        t.setTime(t.getTime() + 864e5 * d),
            (e = "; expires=" + t.toUTCString());
    }
    document.cookie = n + "=" + (v || "") + e + "; path=/";
}
function getCookie(n) {
    var e = n + "=";
    var t = document.cookie.split(";");
    for (var c = 0; c < t.length; c++) {
        var i = t[c];
        while (" " == i.charAt(0)) i = i.substring(1);
        if (0 == i.indexOf(e)) return i.substring(e.length);
    }
    return null;
}
function eraseCookie(n) {
    document.cookie = n + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

/**
 * A customizable toggler class with multiple buttons and callbacks.
 *
 * @example
 * // Create a new toggler with 3 buttons and their respective handlers
 * const toggler = new Toggler("toggler-container", {
 *   buttons: {
 *     light: ["light.svg", light_handler],
 *     dark: ["dark.svg", dark_handler],
 *     sync: ["sync.svg", sync_handler]
 *   },
 *   slidersize: 200,
 *   initial: "light",
 *   "heightmod": 1,
 *   "widthmod": 1,
 *   "radiusmod": 1,
 *   "containerstyle": {
 *       "position": "fixed",
 *       "bottom": "10px",
 *       "right": "10px"
 *   },
 *   "svgsizemod": 3,
 * });
 *
 * // Add a new button after creating the toggler
 * toggler.addButton("new", "new.svg");
 *
 * // Add a new callback after creating the toggler
 * toggler.addCallback("new", new_handler);
 */
class Toggler {
    constructor(containerId, options = {}) {
        this.id = Toggler.generateUniqueId();
        this.containerId = containerId;
        this.slidersize = options.slidersize || 100;
        this.selected = 1;
        this.callbacks = {};

        this.createContainer();
        this.setupOptions(options);
    }

    // Generate a unique ID for the toggler
    static generateUniqueId() {
        return Math.random().toString(36).substring(2, 15);
    }

    // Create the container and slider elements
    createContainer() {
        document.getElementById(this.containerId).innerHTML = `
        <div id="${this.id}" class="toggle-container">
          <div class="slider"></div>
        </div>
      `;

        this.slider = document.querySelector(`#${this.containerId} .slider`);
    }

    // Setup the initial options provided in the constructor
    setupOptions(options) {
        this.heightmod = options.heightmod || 1;
        this.widthmod = options.widthmod || 1;
        this.radiusmod = options.radiusmod || 1;
        this.containerstyle = options.containerstyle || {};
        this.svgsizemod = options.svgsizemod || 0;

        if (options.buttons) {
            for (const button in options.buttons) {
                const [svg, callback] = options.buttons[button];
                this.addButton(button, svg);
                this.addCallback(button, callback);
            }
        }

        if (options.initial) {
            this.setSelected(options.initial);
        }
    }

    // Run the callback function for the button with the given ID
    _runCallback(id) {
        if (this.callbacks[id]) {
            this.callbacks[id]();
        }
    }

    // Add a callback function to the toggler
    addCallback(id, callback) {
        this.callbacks[id] = callback;
    }

    // Set the selected button and update the slider position
    setSelected(id) {
        this._runCallback(id);
        const buttonIndex = Array.from(
            document.getElementById(this.id).children
        ).indexOf(document.getElementById(id));
        this.selected = buttonIndex;
        this.slider.style.transform = `translateX(${
            (this.selected - 1) * 100
        }%)`;
    }

    // Add a button to the toggler with the given ID and SVG file
    addButton(id, svgFile) {
        const buttonHtml = this.createButtonHtml(id, svgFile);
        document
            .getElementById(this.id)
            .insertAdjacentHTML("beforeend", buttonHtml);
        document
            .getElementById(id)
            .addEventListener("click", () => this.setSelected(id));

        this.updateButtonStyles();
    }

    // Create the HTML for a button with the given ID and SVG file
    createButtonHtml(id, svgFile) {
        return `
        <button id="${id}" class="toggle-button">
          <div class="svg-container">
            <img class="svg-filter" src="${svgFile}" alt="SVG Image" />
          </div>
        </button>
      `;
    }

    _setStyles(element, styles) {
        for (const property in styles) {
            element.style[property] = styles[property];
        }
    }

    // Update the styles of the buttons and slider based on the current state
    updateButtonStyles() {
        const buttonCount = document.querySelectorAll(
            `#${this.containerId} .toggle-button`
        ).length;
        const buttonWidth = `${100 / buttonCount}%`;
        const toggleContainer = document.getElementById(this.id);

        // Set timeout
        setTimeout(() => {
            document.body.style.transition = "all 0.3s ease-in-out";
        }, 100);

        // Set the svg container styles
        document
            .querySelectorAll(`#${this.containerId} .svg-container`)
            .forEach((svgContainer) => {
                this._setStyles(svgContainer, {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    padding: "10px",
                });
            });
        // Set the slider
        this._setStyles(this.slider, {
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: buttonWidth,
            backgroundColor: "var(--light-highlight-color)",
            transition: "transform 0.3s ease-in-out",
            zIndex: 2,
            transform: `translateX(${(this.selected - 1) * 100}%)`,
            borderRadius: `${this.slidersize / (2 * this.radiusmod)}px`,
        });

        // Set the button styles
        document
            .querySelectorAll(`#${this.containerId} .toggle-button`)
            .forEach((button) => {
                this._setStyles(button, {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    outline: "none",
                    zIndex: 3,
                });
            });

        // Set the container styles
        this._setStyles(toggleContainer, {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            backgroundColor: "var(--foreground-color)",
            transition: "background-color 0.4s ease-in-out",
            width: this.slidersize * buttonCount * this.widthmod + "px",
            height: this.slidersize * this.heightmod + "px",
            borderRadius: this.slidersize / (2 * this.radiusmod) + "px",
        });

        // Set the custom container styles
        this._setStyles(toggleContainer, this.containerstyle);

        // Set the width for each button and the slider
        document
            .querySelectorAll(`#${this.containerId} .toggle-button`)
            .forEach((button) => {
                button.style.width = buttonWidth;
            });

        // Set the size of the SVG images and the slider border radius
        document
            .querySelectorAll(`#${this.containerId} .toggle-button img`)
            .forEach((img) => {
                this._setStyles(img, {
                    width: `${this.slidersize / 2 + this.svgsizemod}px`,
                    height: `${this.slidersize / 2 + this.svgsizemod}px`,
                });
            });
    }
}
