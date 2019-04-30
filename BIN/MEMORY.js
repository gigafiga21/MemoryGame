function isFunction(e){return e instanceof Function}function isArray(e){return e instanceof Array}function isObject(e){return e instanceof Object}function isElement(e){return e instanceof Element}function isText(e){return e instanceof Text}function isString(e){return"string"==typeof e}Element.prototype.setEventListeners=function(e){if(e&&isObject(e)){this.__events__=this.__events__||{};for(var t in e)isArray(e[t])||(e[t]=[e[t]]),this.__events__[t]=this.__events__[t]||[],e[t].forEach(function(e){isFunction(e)?("resize"==t&&"IFRAME"!=this.tagName&&this.__events__.resize&&!this.__events__.resize.length&&(this.__resizer__=this.newChildElementBefore(this.children[0],"iframe",{style:"WIDTH:100%;HEIGHT:100%;POSITION:ABSOLUTE;OPACITY:0;BORDER:NONE;",name:"BASIS__RESIZER"}),this.__resizer__.contentWindow.onresize=function(){this.dispatchEvent(new Event("resize"))}.bind(this)),this.__events__[t].push(e),this.addEventListener(t,e)):console.warn('ERROR: cannot set something except Function as an event listener to event, called "'+t+'". Skipping.')}.bind(this))}else console.warn("ERROR: argument passed to setEventListeners method is not an Object. Skipping.")},Element.prototype.removeEventListeners=function(e){if(e&&isObject(e)){this.__events__=this.__events__||{};for(var t in e)isArray(e[t])||(e[t]=[e[t]]),this.__events__[t]=this.__events__[t]||[],e[t].forEach(function(e){if(isFunction(e)){var n=this.__events__[t].indexOf(e);-1!=n&&(this.__events__[t].splice(n,1),"resize"!=t||this.__events__[t].length||this.removeChildren(this.__resizer__)),this.removeEventListener(t,e)}else console.warn('ERROR: cannot remove something except Function as an event listener to event, called "'+t+'". Skipping.')}.bind(this))}else console.warn("ERROR: argument passed to setEventListeners method is not an Object. Skipping.")},Element.prototype.cloneElement=function(e){var t;return t=(e.deep,this.cloneNode(!0)),e.listeners&&(t.__events__=this.__events__,t.setEventListeners(t.__events__)),t},Element.prototype.removeCSS=function(){Array.from(arguments).forEach(function(e){isString(e)?this.classList.remove(e):isArray(e)?this.setCSS.apply(this,e):console.warn("ERROR: cannot remove something except String as an CSS-class. Skipping.")}.bind(this))},Element.prototype.setCSS=function(){Array.from(arguments).forEach(function(e){isString(e)?this.classList.add(e):isArray(e)?this.setCSS.apply(this,e):console.warn("ERROR: cannot set something except String as an CSS-class. Skipping.")}.bind(this))},Element.prototype.setAttributes=function(e){if(isObject(e))for(var t in e)e[t]?this.setAttribute(t,e[t]):this.removeAttribute(t);else console.warn("ERROR: argument passed to setAttributes method is not an Object. Skipping.")},Element.prototype.removeAttributes=function(){Array.from(arguments).forEach(function(e){isString(e)?this.removeAttribute(e):isArray(e)?this.removeAttributes.apply(this,e):console.warn("ERROR: cannot remove attribute because given id is not a String. Skipping.")}.bind(this))},Element.prototype.setProperties=function(e){isObject(e.eventListeners)?this.setEventListeners(e.eventListeners):e.eventListeners&&console.warn("ERROR: argument passed to setEventListeners method is not an Object. Skipping"),isArray(e.classList)||isString(e.classList)?this.setCSS(e.classList):e.classList&&console.warn("ERROR: cannot set something except String or Array as an CSS-class. Skipping."),delete e.eventListeners,delete e.classList,this.setAttributes(e)},Element.prototype.appendChildren=function(){Array.from(arguments).forEach(function(e){isElement(e)?this.appendChild(e):isText(e)||isString(e)?this.innerHTML+=e:isArray(e)&&!isString(e)?this.appendChildren.apply(this,e):(console.log(e),console.warn("ERROR: cannot append something except String, Text or Element as an DOMElement. Skipping."))}.bind(this))},Element.prototype.removeChildren=function(){Array.from(arguments).forEach(function(e){isElement(e)||isText(e)?this.removeChild(e):isArray(e)&&!isString(e)?this.removeChildren.apply(this,e):console.warn("ERROR: cannot remove something except Text or Element as an DOMElement. Skipping.")}.bind(this))},Document.prototype.newElement=function(){if("string"!=typeof(arguments=Array.from(arguments))[0])return console.warn("ERROR: first argument passed to newElement method is not an String. Skipping."),null;var e=document.createElement(arguments[0]);return!(arguments=arguments.slice(1))[0]||isArray(arguments[0])||isElement(arguments[0])||isString(arguments[0])||(e.setProperties(arguments[0]),arguments=arguments.slice(1)),arguments[0]&&(isArray(arguments[0])||isElement(arguments[0])||isString(arguments[0]))&&e.appendChildren.apply(e,arguments),e},Element.prototype.newChildElement=function(){var e=document.newElement.apply(null,arguments);return e&&this.appendChild(e),e},Element.prototype.newChildElementBefore=function(){var e=document.newElement.apply(null,Array.from(arguments).splice(1,arguments.length-1));return e&&(isElement(arguments[0])?this.insertBefore(e,arguments[0]):this.appendChild(e)),e};
/**
 * Gets left and top coords of the Element in the DOM relating to the body
 * @param {Element} element - element to get coords
 * @param {Element} parent  - element to create coordinate grid
 * @return {Object} coords
 */
function getRelateBoundingRect(element, parent)
{
    var elementScreenCoords = element.getBoundingClientRect(),
        parentScreenCoords = parent.getBoundingClientRect(),
        parentScroll =
    {
        top: parent.scrollTop,
        left: parent.scrollLeft
    };

    var elementRelateCoords =
    {
        top: elementScreenCoords.top - parentScreenCoords.top + parentScroll.top,
        left: elementScreenCoords.left - parentScreenCoords.left + parentScroll.left
    };

    return elementRelateCoords;
}

/**
 * Hides menu elements recoursively with animation
 * @param {Number} number     - index of element in elements to hide
 * @param {Array} elements    - elements to hide
 * @param {Number} duration   - duration of the animation
 * @param {Boolean} value     - if true hides element else - unhides
 * @param {Function} follower - function runs after everithing done
 */
function toggleHideElements(elements, duration, value, follower)
{
    function main(number, elements, duration, value, follower)
    {
        elements[number].style.opacity = value ? 0 : 1;

        setTimeout((function()
        {
            number++;

            if (number < elements.length)
            {
                main(number, elements, duration, value);
            }
        }).bind(null, number, elements, duration, value), duration * 1000);
    }

    main(0, elements, duration, value);
    setTimeout(follower, elements.length * duration * 1000);
}

/**
 * Parses quant of DOM changes
 */
function triggerCSS()
{
    document.body.offsetWidth;
}

/**
 * Deletes element on the random position from array
 * @return {*} - deleted element
 */
Array.prototype.popRandom = function()
{
    var index = Math.floor(Math.random() * (this.length)),
        random = this[index];

    this.splice(index, 1);
    return random;
}
/**
 * Class of events inserting to the custom classes
 * @param {Object} properties             - settings of the class
 * @param {Array} properties.types        - types of events
 * @param {Element|null} properties.event - target element and object passing to the event listener
 */
function ClassEvents(properties)
{
    /**
     * Object with event types and listeners
     * @typeof {Object}
     */
    this._events = {};

    /**
     * DOMElement where to parse unknown events
     * @typeof {Element|null}
     */
    this._target = properties.event ? properties.event.target : null;

    /**
     * Argument passing to the event listener
     * @typeof {Object|null}
     */
    this._argument = properties.event;

    /**
     * Parses event immediately
     * @param {String} type    - type of the event
     * @param {...} parameters - parameters to pass for the event listeners
     */
    this.dispatchClassEvent = function(type, parameters)
    {
        try
        {
            this._events[type].forEach((function(listener)
            {
                listener(type, parameters);
            }).bind(this));
        }
        catch (error)
        {
            console.warn("ERROR: no such event type - " + type + ".");
            console.warn(error);
        }
    }

    /**
     * Adds an event listener to the custom class
     * @param {String} type       - type of the event
     * @param {Function} listener - listener of the event
     */
    this.addEventListener = function(type, listener)
    {
        try
        {
            this._events[type].push(listener);
            return this._events[type][this._events[type].length - 1];
        }
        catch (error)
        {
            if (this._target)
            {
                var object = {};
                object[type] = listener.bind(null, this._argument);
                this._target.setEventListeners(object);
            }
            else
            {
                console.warn("ERROR: no such event type - " + type + ".");
            }
        }
    }

    /**
     * Adds an event listener to the custom class
     * @param {String} type       - type of the event
     * @param {Function} listener - listener of the event
     */
    this.removeEventListener = function(type, listener)
    {
        try
        {
            var index = this._events[type].indexOf(listener);
            if (index > -1)
            {
                this._events[type].splice(index, 1);
            }
            else
            {
                if (this.target)
                {
                    var object = {};
                    object[type] = listener;
                    this._target.removeEventListeners(object);
                }
                else
                {
                    console.warn("ERROR: no such event listener at type - " + type + ".");
                    console.log(listener);
                }
            }
        }
        catch (error)
        {
            if (this._target)
            {
                this._target.removeEventListener(type, listener);
            }
            else
            {
                console.warn("ERROR: no such event type - " + type + ".");
            }
        }
    }

    /**
     * Setting types of events into array
     */
    for (var counter = 0; counter < properties.types.length; counter++)
    {
        if (typeof properties.types[counter] === "string")
        {
            this._events[properties.types[counter]] = [];
        }
    }
}
/**
 * Class of a gaming card
 * @param {Object} properties            - settings of class
 * @param {Bool} properties.hidden       - state of element's visibility
 * @param {Object} properties.size       - object with sizes
 * @param {String} properties.front      - path to front card picture
 * @param {String} properties.back       - path to back card picture
 * @param {Element} properties.parent    - where to place DOM of the class
 * @param {Element} properties.gameField - the most top element where is allow to place card
 */
function Card(properties)
{
    /**
     * State of non-static class elements
     * @type {Object}
     */
    var state =
    {
        cover: "BACK",
        hidden: false
    };

    /**
     * Durations of animations
     * !!!WARNING!!! - dependant from the CSS class
     * @type {Object}
     */
    var animation =
    {
        duration:
        {
            move: 1,
            turn: 0.2,
            remove: 1,
            rotate: 1,
            hide: 1
        },
        changes:
        {
            remove:
            {
                deltaHeight: 10,
                opacity: 0
            },
            hide:
            {
                deltaHeight: 10,
                opacity: 0
            }
        }
    };

    /**
     * DOM tree of the class
     * @type {Object}
     */
    var DOM =
    {
        gameField: null,
        parent: null,
        container: null,
        covers:
        {
            back: null,
            front: null
        }
    };

    /**
     * CSS styles of the class
     * @type {Object}
     */
    var CSS =
    {
        hidden: "HIDDEN",
        container:
        {
            normal: "CARD__CONTAINER",
            turned: "CARD__CONTAINER--TURNED"
        },
        covers:
        {
            common: "CARD__COVER",
            back: "CARD__BACK",
            front: "CARD__FRONT"
        }
    };

    /**
     * User information about this card
     * @type {Object}
     */
    this.dataset = {};

    /**
     * Object with style setters
     * @type {Object}
     */
    this.style = {};

    /**
     * Hides DOMElement pf the card class
     * @param {Bool} animate - if true then animation of turning will be added
     */
    this.toggleHidden = function()
    {
        switch (state.hidden)
        {
            case true:

                DOM.container.classList.remove(CSS.hidden);
                state.hidden = false;
                break;

            case false:

                DOM.container.classList.add(CSS.hidden);
                state.hidden = true;
                break;
        }
    }

    /**
     * Removes a card DOM and class
     * @param {Bool} animate - if true then animation of removing will be added
     */
    this.remove = function(animate)
    {
        if (animate)
        {
            var coords = getRelateBoundingRect(DOM.container, DOM.gameField);
            triggerCSS();

            var card = DOM.container.cloneElement({deep: true, listeners: true});
            DOM.parent.removeChild(DOM.container);
            DOM.container = card;

            DOM.container.style.left = coords.left + "PX";
            DOM.container.style.top = coords.top + "PX";
            DOM.gameField.appendChildren(DOM.container);

            triggerCSS();
            DOM.container.style.left = coords.left - animation.changes.remove.deltaHeight / 2 + "PX";
            DOM.container.style.top = coords.top - animation.changes.remove.deltaHeight / 2 + "PX";
            card.style.height = card.clientHeight + animation.changes.remove.deltaHeight + "PX";
            card.style.opacity = animation.changes.remove.opacity;

            setTimeout((function()
            {
                this.dispatchClassEvent("remove");
                card.parentNode.removeChild(card);
            }).bind(this), animation.duration.remove * 1000);
        }
        else
        {
            this.dispatchClassEvent("remove");
            DOM.parent.removeChild(DOM.container);
        }
    }

    /**
     * Hides card DOM
     * @param {Boolean} animation - if true animation will be used
     */
    this.hide = function(animation)
    {
        if (animation)
        {
            triggerCSS();

            var card = DOM.container.cloneElement({deep: true, listeners: true});;
            DOM.parent.removeChild(DOM.container);
            DOM.gameField.appendChildren(card);
            DOM.container = card;
            card.style.height = card.clientHeight + animation.changes.hide.deltaHeight + "PX";
            card.style.opacity = animation.changes.hide.opacity;

            setTimeout((function()
            {
                this.dispatchClassEvent("hide");
                DOM.container.classList.add(CSS.hidden);
            }).bind(this), animation.duration.hide * 1000);
        }
        else
        {
            DOM.container.classList.add(CSS.hidden);
        }
    }

    /**
     * Unides card DOM
     * @param {Boolean} animation - if true animation will be used
     */
    this.unhide = function(animation)
    {

        if (animation)
        {
            triggerCSS();

            DOM.container.classList.remove(CSS.hidden);
            DOM.container.style.height = DOM.container.clientHeight - animation.changes.hide.deltaHeight + "PX";
            DOM.container.style.opacity = !animation.changes.hide.opacity;

            setTimeout((function()
            {
                var card = DOM.container.cloneElement({deep: true, listeners: true});
                DOM.container.parentNode.removeChildren(DOM.container);
                DOM.parent.appendChild(card);
                DOM.container = card;

                this.dispatchClassEvent("unhide");
            }).bind(this), animation.duration.hide * 1000);
        }
        else
        {
            DOM.container.classList.remove(CSS.hidden);
        }
    }

    /**
     * Rotates card to angle
     * @param {Number} angle - angle of rotation between -360 and 360 if not given then 0
     * @param {Bool} animate - if true then animation of rotating will be added
     */
    this.rotate = function(angle, animate)
    {
        if (animate)
        {
            angle = angle ? (angle/Math.abs(angle)) * Math.abs(angle) % 360 : 0;
            DOM.container.style.transform = "ROTATE(" + angle + "DEG)";

            setTimeout((function()
            {
                this.dispatchClassEvent("rotate");
            }).bind(this), animation.duration.rotate * 1000);
        }
    }

    /**
     * Turns card front or back
     * @param {Bool} animate - if true then animation of turning will be added
     */
    this.turn = function(animate)
    {
        if (animate)
        {
            triggerCSS();

            switch (state.cover)
            {
                case "BACK":

                    DOM.container.setAttribute("data-tid", "Card-flipped");
                    DOM.container.classList.add(CSS.container.turned);
                    state.cover = "FRONT"
                    break;

                case "FRONT":

                    DOM.container.setAttribute("data-tid", "Card");
                    DOM.container.classList.remove(CSS.container.turned);
                    state.cover = "BACK"
                    break;
            }

            setTimeout((function()
            {
                this.dispatchClassEvent("turn", {target: DOM.container, state: state, card: this});
            }).bind(this), animation.duration.turn * 1000);
        }
    }

    /**
     * Moves card container in DOM with same absolute position
     */
    this.take = function(element)
    {
        var start = getRelateBoundingRect(DOM.container, element),
            card = DOM.container.cloneElement({deep: true, listeners: true});

        DOM.parent.removeChildren(DOM.container);
        DOM.parent = element;
        DOM.container = card;

        DOM.container.style.top = start.top + "PX";
        DOM.container.style.left = start.left + "PX";
        DOM.parent.appendChildren(DOM.container);

        this.dispatchClassEvent("take");
    }

    /**
     * Moves card to another container
     * @param {Element} element - where to move card
     * @param {Element} size    - size of the card after moving, if not given then size of the block
     */
    this.move = function(element, size, animate)
    {
        if (element instanceof Element)
        {
            var start = getRelateBoundingRect(DOM.container, DOM.gameField),
                end = getRelateBoundingRect(element, DOM.gameField),
                card = DOM.container.cloneElement({deep: true, listeners: true});

            //console.log(DOM.container, DOM.container.parentNode);
            DOM.parent.removeChild(DOM.container);
            DOM.container = card;
            DOM.parent = element;

            if (animate)
            {
                DOM.container.style.top = start.top + "PX";
                DOM.container.style.left = start.left + "PX";
                DOM.gameField.appendChildren(DOM.container);
                triggerCSS();

                DOM.container.style.height = size ? size.height : null;
                DOM.container.style.width = size ? size.width : null;
                DOM.container.style.top = end.top + "PX";
                DOM.container.style.left = end.left + "PX";

                setTimeout((function()
                            {
                                card = DOM.container.cloneElement({deep: true, listeners: true});
                                DOM.container.parentNode.removeChild(DOM.container);
                                DOM.container = card;

                                DOM.container.style.top = "0PX";
                                DOM.container.style.left = "0PX";

                                DOM.parent.appendChildren(DOM.container);

                                this.dispatchClassEvent("move", {target: DOM.container, state: state});
                            }).bind(this), animation.duration.move * 1000);
            }
            else
            {
                element.appendChild(DOM.container);
                DOM.container.style.height = size ? size.height : null;
                DOM.container.style.width = size ? size.width : null;

                this.dispatchClassEvent("move", {target: DOM.container, state: state});
            }
        }
    }

    /**
     * Moves card to new left and top coords
     * @param {Number} left - left coord of the card
     * @param {Number} top - top coord of the card
     */
    this.moveTo = function(left, top)
    {
        if (left)
        {
            DOM.container.style.left = left;
        }
        if (top)
        {
            DOM.container.style.top = top;
        }

        setTimeout((function()
        {
            this.dispatchClassEvent("moveTo", {target: DOM.container, state: state});
        }).bind(this), animation.duration.move * 1000);
    }

    /**
     * Creating DOM of class
     */
    if (properties.parent instanceof Element)
    {
        DOM.gameField = properties.gameField ? properties.gameField : document.body;
        DOM.parent = properties.parent;
        DOM.container = DOM.parent.newChildElement("div", {classList: CSS.container.normal, "data-tid": "Card"});
        DOM.container.style.height = properties.size.height;
        DOM.container.style.width = properties.size.width;

        DOM.covers.front = DOM.container.newChildElement("img", {classList: [CSS.covers.common, CSS.covers.front], src: properties.front});
        DOM.covers.back = DOM.container.newChildElement("img", {classList: [CSS.covers.common, CSS.covers.back], src: properties.back});

        if (properties.hidden === true)
        {
            this.toggleHidden();
        }
    }

    /**
     * Gets state of covers turn
     * @return {String} - turn state
     */
    Object.defineProperty(this, "cover",
    {
        get: (function()
        {
            return state.cover;
        }).bind(this)
    });

    /**
     * Setts desk height
     * @param {String} height - size to set
     */
    Object.defineProperty(this.style, "height",
    {
        set: (function(height)
        {
            DOM.container.style.height = height;
        }).bind(this)
    });

    /**
     * Setts desk width
     * @param {String} width - size to set
     */
    Object.defineProperty(this.style, "width",
    {
        set: (function(width)
        {
            DOM.container.style.width = width;
        }).bind(this)
    });

    /**
     * Creating events of class
     */
    ClassEvents.apply(
        this,
        [
            {
                types: ["turn", "move", "moveTo", "remove", "rotate", "hide", "take"],
                event: {target: DOM.container, card: this}
            }
        ]
    );
}
/**
 * Class of the card pack (deck)
 * @param {Object} properties         - settings of the class
 * @param {Array} properties.cards    - cards to put into the deck
 * @param {Object} properties.size    - size of the card desk, 100% of parent in DOM if not given
 * @param {Element} properties.parent - where to place deck DOMElement
 */
function Desk(properties)
{
    /**
     * Cards in the deck
     */
    this.cards = [];

    /**
     * State of non-static class elements
     * @type {Object}
     */
    var state =
    {
        type: "BOX",
        fanHiddenCards: 0
    };

    /**
     * Durations of animations
     * !!!WARNING!!! - dependant from the CSS class
     * @type {Object}
     */
    var animation =
    {
        duration:
        {
            hide: 1
        }
    };

    /**
     * Cards in the deck
     */
    var DOM =
    {
        container: null,
        parent: null
    };

    /**
     * Cards in the deck
     */
    var CSS =
    {
        hidden: "HIDDEN",
        container: "DESK__CONTAINER"
    };

    /**
     * Object with style setters
     * @type {Object}
     */
    this.style = {};

    /**
     * Takes a top card from the deck
     * @param {Element} element - where to put popped card
     * @return {Card}           - instance of the Card class taken from desk
     */
    this.pop = function(element, size, animation)
    {
        var popped = this.cards.pop();

        if (element instanceof Element)
        {
            popped.move(element, size, animation);
        }

        return popped;
    }

    /**
     * Pushs a new card to the deck
     * @param {Element} card - card to push into the desk
     */
    this.push = function(card, size, animation)
    {
        this.cards.push(card);
        card.move(DOM.container, size, animation);
    }

    /**
     * Destroys all instances of a Card class in current desk
     */
    this.removeCards = function()
    {
        for (var counter = 0; counter < this.cards.length; counter++)
        {
            this.cards[counter].remove(false);
        }
    }

    /**
     * Changes type of desk - plain or fan
     * @param {Number} amount     - amount of cards to be fanned
     * @param {Number} deltaAngle - angle between fanned cards
     * @param {Number} deltaSpace - space between fanned cards
     * @param {Bool} animation    - if true then animation of rotation will be added
     */
    this.toggleFan = function(amount, deltaAngle, deltaSpace, animation)
    {
        if (state.type == "BOX")
        {
            var halfAngle = deltaAngle * amount / 2,
                halfSpace = deltaSpace * amount / 2;

            for (var counter = amount; counter < this.cards.length; counter++)
            {
                this.cards[counter].hide(false);
            }

            for (var counter = 0; counter < amount && counter < this.cards.length; counter++)
            {
                this.cards[counter].rotate(deltaAngle * (counter + 0.5) - halfAngle, true);
                this.cards[counter].moveTo(deltaSpace * (counter + 0.5) - halfSpace + "PX", null);
            }

            state.type = "FAN";
            state.fanHiddenCards = amount;
        }
        else
        {
            /**
             * Unhides hidden cards after type of desk turned from fan to box
             */
            function unhide()
            {
                for (var counter = state.fanHiddenCards; counter < this.cards.length; counter++)
                {
                    this.cards[counter].unhide(false);
                }

                this.dispatchClassEvent("closeFan");
                this.cards[0].removeEventListener("rotate", unhideId);
                state.fanHiddenCards = 0;
            }

            var unhideId = this.cards[0].addEventListener("rotate", unhide.bind(this));

            for (var counter = 0; counter < state.fanHiddenCards && counter < this.cards.length; counter++)
            {
                this.cards[counter].rotate(0, true);
                this.cards[counter].moveTo(0 + "PX", null);
            }

            state.type = "BOX";
        }
    }

    /**
     * Moves card from the desk container in DOM with same absolute position
     */
    this.take = function(element)
    {
        var taken = this.cards.pop();
        taken.take(element);

        return taken;
    }

    /**
     * Hides desk DOM
     * @param {Boolean} animation - if true animation will be used
     */
    this.hide = function(animation)
    {
        if (animation)
        {
            DOM.container.style.opacity = 0;

            setTimeout((function()
            {
                this.dispatchClassEvent("hide");
                DOM.container.classList.add(CSS.hidden);
            }).bind(this), animation.duration.hide * 1000);
        }
        else
        {
            DOM.container.classList.add(CSS.hidden);
        }
    }

    /**
     * Unides desk DOM
     * @param {Boolean} animation - if true animation will be used
     */
    this.unhide = function(animation)
    {

        if (animation)
        {
            triggerCSS();

            DOM.container.classList.remove(CSS.hidden);
            DOM.container.style.opacity = 1;

            setTimeout((function()
            {
                this.dispatchClassEvent("unhide");
            }).bind(this), animation.duration.hide * 1000);
        }
        else
        {
            DOM.container.classList.remove(CSS.hidden);
        }
    }

    /**
     * Setts desk height
     * @param {String} height - size to set
     */
    Object.defineProperty(this.style, "height",
    {
        set: (function(height)
        {
            DOM.container.style.height = height;

            for (var counter = 0; counter < this.cards.length; counter++)
            {
                this.cards[counter].style.height = height;
            }
        }).bind(this)
    });

    /**
     * Setts desk width
     * @param {String} width - size to set
     */
    Object.defineProperty(this.style, "width",
    {
        set: (function(width)
        {
            DOM.container.style.width = width;

            for (var counter = 0; counter < this.cards.length; counter++)
            {
                this.cards[counter].style.width = width;
            }
        }).bind(this)
    });

    /**
     * Setts desk bottom margin
     * @param {String} width - size to set
     */
    Object.defineProperty(this.style, "marginBottom",
    {
        set: (function(margin)
        {
            DOM.container.style.marginBottom = margin;
        }).bind(this)
    });


    /**
     * Creating DOM of class
     */
    DOM.parent = properties.parent;
    DOM.container = DOM.parent.newChildElement("div", {classList: CSS.container, style: "HEIGHT:" + properties.size.height + ";"});

    /**
     * Connecting with the cards
     */
    properties.cards.forEach((function(card)
    {
        this.push(card, properties.size, false);
    }).bind(this));

    /**
     * Setts desk size
     */
    if (properties.size.height && properties.size.width)
    {
        DOM.container.style.width = properties.size.width;
        DOM.container.style.height = properties.size.height;
        DOM.container.style.marginBottom = DOM.container.offsetWidth / 2 + "PX";
    }
    else if (this.cards.length)
    {
        this.setSize();
    }

    /**
     * Creating events of class
     */
    ClassEvents.apply(
        this,
        [
            {
                types: ["closeFan", "hide", "unhide"],
                event: {target: DOM.container, desk: this}
            }
        ]
    );
}
/**
 * Class of a memory game
 * @param {Object} properties            - settings of class
 * @param {Element} properties.parent    - where to place DOM of the class
 * @param {Object} properties.cardCovers - back and fronts of the card
 * @param {Object} properties.coverSize  - sizes of the card
 */
function MemoryGame(properties)
{
    /**
     * DOM tree of the class
     * @type {Object}
     */
    var DOM =
    {
        parent: null,
        container: null,
        pause:
        {
            menu: null,
            deskContainer: null,
            headline: null,
            optionsContainer: null,
            options:
            {
                continue: null,
                newGame: null
            }
        },
        game:
        {
            cardsContainer: null,
            statusbar: null,
            score: null,
            pauseButton: null,
            field: null
        }
    }

    var CSS =
    {
        hidden: "HIDDEN",
        wrap: "WRAP",
        divider: "DIVIDER",
        cardsContainer: "MEMORY__CARDSCONTAINER",
        button: "MEMORY__BUTTON",
        container:
        {
            common: "MEMORY__CONTAINER",
            pause: "MEMORY__CONTAINER--PAUSE",
            game: "MEMORY__CONTAINER--GAME",
        },
        pause:
        {
            menu: "MEMORY__MENU",
            deskContainer: "MEMORY__DESKCONTAINER",
            headline: "MEMORY__HEADLINE"
        },
        game:
        {
            main: "MEMORY__GAME",
            statusbar: "MEMORY__STATUSBAR",
            field: "MEMORY__FIELD"
        }
    }

    /**
     * Duration of the period for player to memorise cards
     * @type {Number}
     */
    var memoriseDuration = 5;

    /**
     * State of non-static class elements
     * @type {Object}
     */
    var state =
    {
        screen: "MENU",
        score: 0,
        cardsTurnable: false,
        turnedCardId: null,
        turnedCard: null,
        newGame: 1,
        isWin: 0
    };

    /**
     * Cards
     * @type {Array}
     */
    var cards = [];

    /**
     * Desk in the menu
     * @type {Object}
     */
    var desk;

    /**
     * Durations of animations
     * !!!WARNING!!! - dependant from the CSS class
     * @type {Object}
     */
    var animation =
    {
        duration:
        {
            hide: 0.3
        }
    };

    /**
     * Sizes of the DOM elements
     * @type {Object}
     */
    var sizes =
    {
        desk:
        {
            width: 0,
            height: 0
        },
        deskContainer:
        {
            marginBottom: 0,
            left: 0,
            top: 0
        },
        card:
        {
            width: 0,
            height: 0
        },
        field:
        {
            rows: 0,
            cols: 0
        },
        menuFan:
        {
            cardsAmount: 4
        }
    };

    /**
     * Gets sizes of cards and desks from parent sizes
     */
    function getSizes()
    {
        sizes.field.rows = 3;
        sizes.field.cols = 6;

        sizes.desk.height = DOM.parent.offsetHeight / 3;
        sizes.desk.width = properties.coverSize.width * sizes.desk.height / properties.coverSize.height;
        sizes.deskContainer.marginBottom = sizes.desk.width / 2;

        sizes.card.height = DOM.parent.offsetHeight / 4.5;
        sizes.card.width = properties.coverSize.width * sizes.card.height / properties.coverSize.height;
    }

    /**
     * Sets sizes of cards and desks to DOM elements
     */
    function setSizes()
    {
        if (DOM.container.offsetHeight > DOM.container.offsetWidth)
        {
            DOM.container.style.minWidth = DOM.container.offsetHeight + "PX";
        }

        desk.style.height = sizes.desk.height + "PX";
        desk.style.width = sizes.desk.width + "PX";
        desk.style.marginBottom = sizes.deskContainer.marginBottom + "PX";

        for (var counterRow = 0; counterRow < sizes.field.rows; counterRow++)
        {
            for (var counterCol = 0; counterCol < sizes.field.cols; counterCol++)
            {
                DOM.game.field.rows[counterRow].cells[counterCol].style.height = sizes.card.height + "PX";
                DOM.game.field.rows[counterRow].cells[counterCol].style.width = sizes.card.width + "PX";

                var card = cards[counterRow * sizes.field.cols + counterCol];
                if (card)
                {
                    card.style.height = sizes.card.height + "PX";
                    card.style.width = sizes.card.width + "PX";
                }
            }
        }
    }

    function resize()
    {
        function resizeCardsContainer()
        {
            var coords = getRelateBoundingRect(DOM.pause.deskContainer, DOM.container);
            sizes.deskContainer.left = coords.left;
            sizes.deskContainer.top = coords.top;

            DOM.cardsContainer.style.left = sizes.deskContainer.left + "PX";
            DOM.cardsContainer.style.top = sizes.deskContainer.top + "PX";
        }

        if (DOM.container.classList.contains(CSS.container.game))
        {
            DOM.container.classList.remove(CSS.container.game);
            DOM.container.classList.add(CSS.container.pause);
            triggerCSS();
            resizeCardsContainer();
            DOM.container.classList.remove(CSS.container.pause);
            DOM.container.classList.add(CSS.container.game);
        }
        else
        {
            resizeCardsContainer();
        }

        console.log("RESIZING...");

        getSizes();
        setSizes();
    }

    /**
     * Creates a new card
     */
    function createCard(frontCover, hidden, listener, id, position)
    {
        var card = new Card(
        {
            back: properties.cardCovers.back,
            front: frontCover,
            hidden: false,
            parent: DOM.cardsContainer,
            gameField: DOM.container,
            size:
            {
                height: sizes.desk.height + "PX",
                width: sizes.desk.width + "PX"
            }
        });

        card.dataset.id = id;
        card.dataset.position = position;
        card.addEventListener("click", listener);
        return card;
    }

    /**
     * Creates cards for the desk
     */
    function setDeskCards()
    {
        var cardCovers = properties.cardCovers.front;

        desk.removeCards();
        for (var counter = 0; counter < sizes.menuFan.cardsAmount; counter++)
        {
            desk.push(createCard(cardCovers.popRandom(), false, turnFanCard.bind(this)), {height: sizes.desk.height + "PX", width: sizes.desk.width + "PX"}, false);
        }
    }

    /**
     * Creates cards for field and desk for the current game
     */
    function setFieldCards()
    {
        var cardCovers = properties.cardCovers.front.slice(),
            cells = [];

        for (var counterRow = 0; counterRow < sizes.field.rows; counterRow++)
        {
            for (var counterCol = 0; counterCol < sizes.field.cols; counterCol++)
            {
                cells[counterRow * sizes.field.cols + counterCol] =
                {
                    row: counterRow,
                    col: counterCol
                };
            }
        }

        for (var counter = 0; counter < cards.length; counter++)
        {
            cards[counter].remove(false);
        }
        cards = [];

        for (var counter = 0; counter < sizes.field.rows * sizes.field.cols / 2; counter++)
        {
            var randomCover = cardCovers.popRandom();

            cards.push(createCard(randomCover, true, turnCard.bind(this), counter, cells.popRandom()));
            cards.push(createCard(randomCover, true, turnCard.bind(this), counter, cells.popRandom()));
        }
    }

    /**
     * Shows game field
     */
    function toGame()
    {
        /**
         * Turns all cards for some time if the game have just started
         */
        function useMemorisingTime()
        {
            /**
             * Turns all cards for some time if the game have just started
             */
            function turnCards()
            {
                for (var counter = 0; counter < cards.length; counter++)
                {
                    cards[counter].turn(true);
                }
            }

            if (state.newGame)
            {
                state.newGame = 0;
                cards[0].removeEventListener("move", useMemorisingTimeId);
                turnCards();

                setTimeout((function()
                {
                    turnCards();
                    state.cardsTurnable = true;
                    DOM.pause.options.continue.disabled = false;
                    DOM.game.pauseButton.disabled = false;
                }).bind(this), memoriseDuration * 1000);
            }
            else
            {
                state.screen = "GAME";
            }
        }

        /**
         * Passes cards to table
         */
        function passCards()
        {
            DOM.cardsContainer.classList.remove(CSS.hidden);
            DOM.container.classList.remove(CSS.container.pause);
            DOM.container.classList.add(CSS.container.game);
            state.screen = "GAME";

            if (state.newGame)
            {
                useMemorisingTimeId = cards[0].addEventListener("move", useMemorisingTime);
            }
            else
            {
                state.cardsTurnable = true;
            }

            if (state.turnedCard)
            {
                state.turnedCard.turn(true);
            }

            for (var counter = 0; counter < cards.length; counter++)
            {
                cards[counter].move(
                    DOM.game.field.rows[cards[counter].dataset.position.row].cells[cards[counter].dataset.position.col],
                    {height: sizes.card.height + "PX", width: sizes.card.width + "PX"},
                    true
                );
            }

            toggleHideElements([DOM.game.score, DOM.game.pauseButton], animation.duration.hide, false);
            desk.removeEventListener("closeFan", passCardsId);
        }

        var passCardsId = desk.addEventListener("closeFan", passCards.bind(this)),
            useMemorisingTimeId, setTurnEventId;

        for (var counter = 0; counter < desk.cards.length; counter++)
        {
            if (desk.cards[counter].dataset.turned == true)
            {
                desk.cards[counter].turn(true);
            }
        }
        desk.toggleFan();
        toggleHideElements([DOM.pause.options.continue, DOM.pause.options.newGame, DOM.pause.headline], animation.duration.hide, true);
    }

    /**
     * Shows menu of the game
     */
    function toMenu()
    {
        /**
         * Opens a fan of a desk in the pause menu
         */
        function openFan()
        {
            toggleHideElements([DOM.pause.deskContainer], animation.duration.hide, false);
            desk.toggleFan(4, 35, 10, true);
            for (var counter = 0; counter < desk.cards.length; counter++)
            {
                if (state.isWin)
                {
                    desk.cards[counter].turn(true);
                    desk.cards[counter].dataset.turned = true;
                }
                else if (desk.cards[counter].dataset.turned == true)
                {
                    desk.cards[counter].turn(true);
                }
            }
            state.isWin = false;
        }

        /**
         * Shows menu elements
         */
        function showMenu()
        {
            if (state.screen == "GAME")
            {
                cards[0].removeEventListener("move", showMenuId);
                DOM.pause.deskContainer.style.opacity = 1;
                DOM.cardsContainer.classList.add(CSS.hidden);
            }

            if (state.isWin)
            {
                DOM.pause.deskContainer.style.opacity = 0;
                DOM.pause.headline.innerHTML = (state.score >= 0 ? "Победа со счётом: " : "Потрачено: ") + state.score;
                DOM.pause.options.continue.disabled = true;
                state.score = 0;
            }
            else
            {
                DOM.pause.headline.innerHTML = "MEMORY GAME";
            }

            DOM.container.classList.remove(CSS.container.game);
            DOM.container.classList.add(CSS.container.pause);
            state.screen = "MENU";

            toggleHideElements(
                [DOM.pause.options.continue, DOM.pause.options.newGame, DOM.pause.headline],
                animation.duration.hide,
                false,
                openFan.bind(this)
            );
        }

        /**
         * Hides a game field
         */
        function hideGameField(follower)
        {
            toggleHideElements([DOM.game.score, DOM.game.pauseButton], animation.duration.hide, true, follower);
        }

        /**
         * Moves cards from the field to the desk
         */
        function takeCards()
        {
            if (state.turnedCard)
            {
                state.turnedCard.turn(true);
            }

            showMenuId = cards[0].addEventListener("move", showMenu);

            for (var counter = 0; counter < cards.length; counter++)
            {
                cards[counter].move(DOM.cardsContainer, {width: sizes.desk.width + "PX", height: sizes.desk.height + "PX"}, true);
            }
        }

        state.cardsTurnable = false;
        if (state.screen == "GAME")
        {
            var showMenuId;
            hideGameField();
            takeCards();
        }
        else
        {
            hideGameField(showMenu.bind(this));
        }
    }

    /**
     * Turn cards in fan after click
     * @param {MouseEvent} event - event of clicking to a card
     */
    function turnFanCard(event)
    {
        if (event.card.cover == "BACK")
        {
            event.card.dataset.turned = true;
        }
        else
        {
            event.card.dataset.turned = false;
        }
        event.card.turn(true);
    }

    /**
     * Event of clicking to card
     * @param {MouseEvent} event - event of clicking to a card
     */
    function turnCard(event)
    {
        function onTurn(command, card1, card2)
        {
            if (command == "REMOVE")
            {
                card1.remove(true);
                card2.remove(true);
            }
            else if (command == "TURN")
            {
                card1.turn(true);
                card2.turn(true);
            }

            event.card.removeEventListener("turn", turnId);
            card1 = null;
            card2 = null;
        }

        if (state.cardsTurnable)
        {
            var command, card1, card2;

            if (!state.turnedCard)
            {
                state.turnedCard = event.card;
            }
            else if (state.turnedCard == event.card)
            {
                return;
            }
            else if (state.turnedCard.dataset.id == event.card.dataset.id)
            {
                command = "REMOVE";
                card1 = event.card;
                card2 = state.turnedCard;

                cards.splice(cards.indexOf(state.turnedCard), 1);
                cards.splice(cards.indexOf(event.card), 1);
                state.turnedCard = null;

                state.score += 42 * cards.length;
                DOM.game.score.innerHTML = "Cчёт: " + state.score;

                if (!cards.length)
                {
                    state.isWin = true;
                    state.screen = "MENU";
                    toMenu();
                }
            }
            else
            {
                command = "TURN";
                card1 = event.card;
                card2 = state.turnedCard;

                state.turnedCard = null;

                state.score -= 42 * (sizes.field.cols * sizes.field.rows - cards.length);
                DOM.game.score.innerHTML = "Cчёт: " + state.score;
            }

            event.card.turn(true);
            var turnId = event.card.addEventListener("turn", (onTurn).bind(this, command, card1, card2));
        }
    }

    /**
     * Event of clicking to continue button
     */
    function continueGame(event)
    {
        toGame();
    }

    /**
     * Event of clicking to new game button
     */
    function newGame(event)
    {
        state.newGame = 1;
        DOM.game.score.innerHTML = "Счёт: 0";
        DOM.game.pauseButton.disabled = true;
        DOM.pause.options.continue.disabled = true;
        setFieldCards();
        toGame();
    }

    /**
     * Event of clicking to pause buttom
     */
    function pauseGame()
    {
        toMenu();
    }

    DOM.parent = properties.parent;
    DOM.container = DOM.parent.newChildElement("div", {classList: [CSS.container.common, CSS.container.pause, CSS.wrap], "data-tid": "App"});
    DOM.cardsContainer = DOM.container.newChildElement("div", {classList: [CSS.cardsContainer, CSS.hidden]});
    getSizes();

    /**
     * Creating DOM for menu
     */
    DOM.pause.menu = DOM.container.newChildElement("div", {classList: [CSS.pause.menu, CSS.wrap]});
    DOM.pause.deskContainer = DOM.pause.menu.newChildElement("div", {classList: [CSS.pause.deskContainer, CSS.wrap]});
    DOM.pause.headline = DOM.pause.menu.newChildElement("div", {classList: [CSS.pause.headline, CSS.wrap]}, "MEMORY GAME");
    DOM.pause.optionsContainer = DOM.pause.menu.newChildElement("div", {classList: CSS.wrap});
    DOM.pause.options.continue = DOM.pause.optionsContainer.newChildElement("button", {classList: CSS.button}, "Продолжить");
    DOM.pause.options.newGame = DOM.pause.optionsContainer.newChildElement("button", {classList: CSS.button, "data-tid": "NewGame-startGame"}, "Новая игра");

    DOM.container.setEventListeners({resize: resize.bind(this)});
    DOM.pause.options.continue.setEventListeners({click: continueGame.bind(this)});
    DOM.pause.options.newGame.setEventListeners({click: newGame.bind(this)});
    DOM.pause.options.continue.disabled = true;

    /**
     * Creating DOM for game field
     */
    DOM.game.wrap = DOM.container.newChildElement("div", {classList: [CSS.wrap, CSS.game.main]});
    DOM.game.status = DOM.game.wrap.newChildElement("div", {classList: [CSS.wrap, CSS.game.statusbar]});
    DOM.game.score = DOM.game.status.newChildElement("div", {"data-tid": "Menu-scores"}, "Счёт: 0");
    DOM.game.status.newChildElement("div", {classList: CSS.divider});
    DOM.game.pauseButton = DOM.game.status.newChildElement("button", {classList: CSS.button}, "Пауза");
    DOM.game.field = DOM.game.wrap.newChildElement("table", {classList: [CSS.wrap, CSS.game.field], "data-tid": "Deck"});

    var cell = document.newElement("td", {style: "WIDTH:" + sizes.card.width + "PX;HEIGHT:" + sizes.card.height + "PX;"});
    for (var counterRow = 0; counterRow < sizes.field.rows; counterRow++)
    {
        DOM.game.field.newChildElement("tr");
        for (var counterCol = 0; counterCol < sizes.field.cols; counterCol++)
        {
            DOM.game.field.rows[counterRow].appendChild(cell.cloneNode(true));
        }
    }

    DOM.game.pauseButton.setEventListeners({click: pauseGame.bind(this)});

    desk = new Desk(
    {
        cards: [],
        size:
        {
            height: sizes.desk.height + "PX",
            width: sizes.desk.width + "PX"
        },
        parent: DOM.pause.deskContainer
    });

    setDeskCards();
    resize();
    toMenu();
}

