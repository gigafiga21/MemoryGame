window.onload = function()
{
    var covers =
    {
        front:
        [
            "IMG/clubs.6.svg",
            "IMG/clubs.7.svg",
            "IMG/clubs.8.svg",
            "IMG/clubs.9.svg",
            "IMG/clubs.10.svg",
            "IMG/clubs.jack.svg",
            "IMG/clubs.queen.svg",
            "IMG/clubs.king.svg",
            "IMG/clubs.ace.svg",
            "IMG/spades.6.svg",
            "IMG/spades.7.svg",
            "IMG/spades.8.svg",
            "IMG/spades.9.svg",
            "IMG/spades.10.svg",
            "IMG/spades.jack.svg",
            "IMG/spades.queen.svg",
            "IMG/spades.king.svg",
            "IMG/spades.ace.svg",
            "IMG/hearts.6.svg",
            "IMG/hearts.7.svg",
            "IMG/hearts.8.svg",
            "IMG/hearts.9.svg",
            "IMG/hearts.10.svg",
            "IMG/hearts.jack.svg",
            "IMG/hearts.queen.svg",
            "IMG/hearts.king.svg",
            "IMG/hearts.ace.svg",
            "IMG/diamonds.6.svg",
            "IMG/diamonds.7.svg",
            "IMG/diamonds.8.svg",
            "IMG/diamonds.9.svg",
            "IMG/diamonds.10.svg",
            "IMG/diamonds.jack.svg",
            "IMG/diamonds.queen.svg",
            "IMG/diamonds.king.svg",
            "IMG/diamonds.ace.svg"
        ],
        back: "IMG/back.svg"
    };

    var game = new MemoryGame({parent: document.body, cardCovers: covers, coverSize: {height: 320, width: 224}});
};
