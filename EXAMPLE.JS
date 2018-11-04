window.onload = function()
{
    var covers =
    {
        front:
        [
            "BUILD/IMG/CLUBS.6.SVG",
            "BUILD/IMG/CLUBS.7.SVG",
            "BUILD/IMG/CLUBS.8.SVG",
            "BUILD/IMG/CLUBS.9.SVG",
            "BUILD/IMG/CLUBS.10.SVG",
            "BUILD/IMG/CLUBS.JACK.SVG",
            "BUILD/IMG/CLUBS.QUEEN.SVG",
            "BUILD/IMG/CLUBS.KING.SVG",
            "BUILD/IMG/CLUBS.ACE.SVG",
            "BUILD/IMG/SPADES.6.SVG",
            "BUILD/IMG/SPADES.7.SVG",
            "BUILD/IMG/SPADES.8.SVG",
            "BUILD/IMG/SPADES.9.SVG",
            "BUILD/IMG/SPADES.10.SVG",
            "BUILD/IMG/SPADES.JACK.SVG",
            "BUILD/IMG/SPADES.QUEEN.SVG",
            "BUILD/IMG/SPADES.KING.SVG",
            "BUILD/IMG/SPADES.ACE.SVG",
            "BUILD/IMG/HEARTS.6.SVG",
            "BUILD/IMG/HEARTS.7.SVG",
            "BUILD/IMG/HEARTS.8.SVG",
            "BUILD/IMG/HEARTS.9.SVG",
            "BUILD/IMG/HEARTS.10.SVG",
            "BUILD/IMG/HEARTS.JACK.SVG",
            "BUILD/IMG/HEARTS.QUEEN.SVG",
            "BUILD/IMG/HEARTS.KING.SVG",
            "BUILD/IMG/HEARTS.ACE.SVG",
            "BUILD/IMG/DIAMONDS.6.SVG",
            "BUILD/IMG/DIAMONDS.7.SVG",
            "BUILD/IMG/DIAMONDS.8.SVG",
            "BUILD/IMG/DIAMONDS.9.SVG",
            "BUILD/IMG/DIAMONDS.10.SVG",
            "BUILD/IMG/DIAMONDS.JACK.SVG",
            "BUILD/IMG/DIAMONDS.QUEEN.SVG",
            "BUILD/IMG/DIAMONDS.KING.SVG",
            "BUILD/IMG/DIAMONDS.ACE.SVG"
        ],
        back: "BUILD/IMG/BACK.SVG"
    };

    var game = new MemoryGame({parent: document.body, cardCovers: covers, coverSize: {height: 320, width: 224}});

    /*for (var counter = 0; counter < covers.length; counter++)
    {
        cards.push(new Card(
        {
            back: "IMG/CARDS/BACK.SVG",
            front: covers[counter],
            hidden: false,
            parent: document.body.children[0],
            size:
            {
                height: "320PX",
                width: "224PX"
            }
        }));
    }
    console.log(cards);

    var desk = new Desk({cards: cards, size: {height: "320PX"}, parent: document.body.children[1]});
    desk.toggleFan(4, 35, 10, true);*/
    /*var card1 = new Card(
    {
        back: "IMG/CARDS/BACK.SVG",
        front: "IMG/CARDS/CLUBS.ACE.SVG",
        hidden: false,
        parent: document.body.children[0],
        size:
        {
            height: "320PX"
        }
    });
    card1.addEventListener("click", (function()
    {
        console.log("clicked");
        card1.turn(true);
    }).bind(this));
    card1.addEventListener("move", (function()
    {
        console.log("moved");
    }).bind(this));
    card1.addEventListener("turn", (function()
    {
        console.log("turned");
        card1.rotate(10, true);
    }).bind(this));
    card1.addEventListener("turn", (function()
    {
        console.log("removed");
    }).bind(this));*/
};
