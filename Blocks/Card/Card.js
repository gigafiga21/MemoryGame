import { triggerCSS, getRelateBoundingRect } from "../../Libraries/Common/Common.js";
import ClassEvents from "../../Libraries/ClassEvents/ClassEvents.js";

import "./Card.css";

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
export default function Card(properties)
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
