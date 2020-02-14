import "./Menu.css";

/**
 * Class manages menu of the game
 * @param {Element} parent - where to put the block
 */
export default function Menu(parent)
{
    /**
     * DOM tree of the block
     * @type {Object}
     */
    var DOM =
        {
            container: null,
            menu: null,
            deskContainer: null,
            headline: null,
            optionsContainer: null,
            options:
            {
                continue: null,
                newGame: null
            }
        };

    /**
     * CSS classes of the block
     * @type {Object}
     */
    var CSS =
        {
            wrap: "wrap",
            menu: "menu__menu",
            deskContainer: "menu__deskcontainer",
            headline: "menu__headline",
            button: "menu__button",
        };

    /**
     * Creating DOM for menu block
     */
    DOM.menu = parent.newChildElement("div", {classList: [CSS.menu, CSS.wrap]});
    DOM.deskContainer = DOM.menu.newChildElement("div", {classList: [CSS.deskContainer, CSS.wrap]});
    DOM.headline = DOM.menu.newChildElement("div", {classList: [CSS.headline, CSS.wrap]}, "MEMORY GAME");
    DOM.optionsContainer = DOM.menu.newChildElement("div", {classList: CSS.wrap});
    DOM.options.continue = DOM.optionsContainer.newChildElement("button", {classList: CSS.button}, "Продолжить");
    DOM.options.newGame = DOM.optionsContainer.newChildElement("button", {classList: CSS.button, "data-tid": "NewGame-startGame"}, "Новая игра");

    // DOM.container.setEventListeners({resize: resize.bind(this)});
    // DOM.options.continue.setEventListeners({click: continueGame.bind(this)});
    // DOM.options.newGame.setEventListeners({click: newGame.bind(this)});
    DOM.options.continue.disabled = true;
};
