import { triggerCSS } from "../../Libraries/Common/Common.js";
import Card from "../Card/Card.js";
import ClassEvents from "../../Libraries/ClassEvents/ClassEvents.js";

import "./Desk.css";

/**
 * Class of the card pack (deck)
 * @param {Object} properties         - settings of the class
 * @param {Array} properties.cards    - cards to put into the deck
 * @param {Object} properties.size    - size of the card desk, 100% of parent in DOM if not given
 * @param {Element} properties.parent - where to place deck DOMElement
 */
export default function Desk(properties)
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
