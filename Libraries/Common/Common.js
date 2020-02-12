/**
 * Gets left and top coords of the Element in the DOM relating to the body
 * @param {Element} element - element to get coords
 * @param {Element} parent  - element to create coordinate grid
 * @return {Object} coords
 */
export function getRelateBoundingRect(element, parent)
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
export function toggleHideElements(elements, duration, value, follower)
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
export function triggerCSS()
{
    document.body.offsetWidth;
}

/**
 * Deletes element on the random position from array
 * @return {*} - deleted element
 */
export function popRandom()
{
    var index = Math.floor(Math.random() * (this.length)),
        random = this[index];

    this.splice(index, 1);
    return random;
}
