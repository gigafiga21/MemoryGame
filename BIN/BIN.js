window.onload = function()
{
    var covers =
    {
        front:
        [
            "IMG/CLUBS.6.SVG",
            "IMG/CLUBS.7.SVG",
            "IMG/CLUBS.8.SVG",
            "IMG/CLUBS.9.SVG",
            "IMG/CLUBS.10.SVG",
            "IMG/CLUBS.JACK.SVG",
            "IMG/CLUBS.QUEEN.SVG",
            "IMG/CLUBS.KING.SVG",
            "IMG/CLUBS.ACE.SVG",
            "IMG/SPADES.6.SVG",
            "IMG/SPADES.7.SVG",
            "IMG/SPADES.8.SVG",
            "IMG/SPADES.9.SVG",
            "IMG/SPADES.10.SVG",
            "IMG/SPADES.JACK.SVG",
            "IMG/SPADES.QUEEN.SVG",
            "IMG/SPADES.KING.SVG",
            "IMG/SPADES.ACE.SVG",
            "IMG/HEARTS.6.SVG",
            "IMG/HEARTS.7.SVG",
            "IMG/HEARTS.8.SVG",
            "IMG/HEARTS.9.SVG",
            "IMG/HEARTS.10.SVG",
            "IMG/HEARTS.JACK.SVG",
            "IMG/HEARTS.QUEEN.SVG",
            "IMG/HEARTS.KING.SVG",
            "IMG/HEARTS.ACE.SVG",
            "IMG/DIAMONDS.6.SVG",
            "IMG/DIAMONDS.7.SVG",
            "IMG/DIAMONDS.8.SVG",
            "IMG/DIAMONDS.9.SVG",
            "IMG/DIAMONDS.10.SVG",
            "IMG/DIAMONDS.JACK.SVG",
            "IMG/DIAMONDS.QUEEN.SVG",
            "IMG/DIAMONDS.KING.SVG",
            "IMG/DIAMONDS.ACE.SVG"
        ],
        back: "IMG/BACK.SVG"
    };

    var game = new MemoryGame({parent: document.body, cardCovers: covers, coverSize: {height: 320, width: 224}});
};
