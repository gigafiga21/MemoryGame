import { popRandom, triggerCSS, toggleHideElements, getRelateBoundingRect } from "../../Libraries/Common/Common.js";
import Card from "../../Blocks/Card/Card.js";
import Desk from "../../Blocks/Desk/Desk.js";

import "../../Libraries/Common/Common.css";
import "./Memory.css";

Array.prototype.popRandom = popRandom;

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

window.onload = function()
{
    var covers =
    {
        front:
        [
            "Assets/Images/cards/clubs.6.svg",
            "Assets/Images/cards/clubs.7.svg",
            "Assets/Images/cards/clubs.8.svg",
            "Assets/Images/cards/clubs.9.svg",
            "Assets/Images/cards/clubs.10.svg",
            "Assets/Images/cards/clubs.jack.svg",
            "Assets/Images/cards/clubs.queen.svg",
            "Assets/Images/cards/clubs.king.svg",
            "Assets/Images/cards/clubs.ace.svg",
            "Assets/Images/cards/spades.6.svg",
            "Assets/Images/cards/spades.7.svg",
            "Assets/Images/cards/spades.8.svg",
            "Assets/Images/cards/spades.9.svg",
            "Assets/Images/cards/spades.10.svg",
            "Assets/Images/cards/spades.jack.svg",
            "Assets/Images/cards/spades.queen.svg",
            "Assets/Images/cards/spades.king.svg",
            "Assets/Images/cards/spades.ace.svg",
            "Assets/Images/cards/hearts.6.svg",
            "Assets/Images/cards/hearts.7.svg",
            "Assets/Images/cards/hearts.8.svg",
            "Assets/Images/cards/hearts.9.svg",
            "Assets/Images/cards/hearts.10.svg",
            "Assets/Images/cards/hearts.jack.svg",
            "Assets/Images/cards/hearts.queen.svg",
            "Assets/Images/cards/hearts.king.svg",
            "Assets/Images/cards/hearts.ace.svg",
            "Assets/Images/cards/diamonds.6.svg",
            "Assets/Images/cards/diamonds.7.svg",
            "Assets/Images/cards/diamonds.8.svg",
            "Assets/Images/cards/diamonds.9.svg",
            "Assets/Images/cards/diamonds.10.svg",
            "Assets/Images/cards/diamonds.jack.svg",
            "Assets/Images/cards/diamonds.queen.svg",
            "Assets/Images/cards/diamonds.king.svg",
            "Assets/Images/cards/diamonds.ace.svg"
        ],
        back: "Assets/Images/cards/back.svg"
    };

    var game = new MemoryGame({parent: document.body, cardCovers: covers, coverSize: {height: 320, width: 224}});
};
