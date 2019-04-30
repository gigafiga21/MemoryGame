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
};
