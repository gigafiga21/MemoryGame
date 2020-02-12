/**
 * Class of events inserting to the custom classes
 * @param {Object} properties             - settings of the class
 * @param {Array} properties.types        - types of events
 * @param {Element|null} properties.event - target element and object passing to the event listener
 */
export default function ClassEvents(properties)
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
