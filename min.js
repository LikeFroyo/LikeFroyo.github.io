var deck = [];
var playerScore = 0;
var dealerScore = 0;
/* Card-Value Map */
var faceValues = new Map([
    ['ACE', [1, 11]], ['TWO', 2],
    ['THREE', 3], ['FOUR', 4],
    ['FIVE', 5], ['SIX', 6],
    ['SEVEN', 7], ['EIGHT', 8],
    ['NINE', 9], ['TEN', 10],
    ['JACK', 10], ['QUEEN', 10], ['KING', 10]
]);

/* Display A Modal Popup And Block The BackGround Task */
function DisplayPopupAndReturnBanner() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    return document.getElementById("resultBanner");
}

/* Declare Player Win Function For BlackJack */
function DeclarePlayerWin() {
    var banner = DisplayPopupAndReturnBanner();
    banner.innerHTML = "PLAYER WIN!";
}

/* Declare Dealer Win Function For BlackJack */
function DeclareDealerWin() {
    var banner = DisplayPopupAndReturnBanner();
    banner.innerHTML = "DEALER WIN!";
}

/* Declare Player Busted Function For 21 OverFlow */
function DeclarePlayerBusted() {
    var banner = DisplayPopupAndReturnBanner();
    banner.innerHTML = "PLAYER BUSTED!";
}

/* Declare Dealer Win Function For 21 OverFlow */
function DeclareDealerBusted() {
    var banner = DisplayPopupAndReturnBanner();
    banner.innerHTML = "DEALER BUSTED!";
}

/* Get A Valid Calculated Score For The Current Player based Upon Current Score & Card */
function GetCreditScore(playerScore, card) {
    /* get the corresponding from map */
    var score = faceValues.get(card.value);
    /* check for ace , can have 1 or 11*/
    return (card.value === 'ACE') ? (playerScore + score[1] > 21 ? score[0] : score[1]) : score;
}

/* Display The Card On The PLayerBoard #params(TypeOfGamer(player/Dealer) , TheCard, VisibilityOFCard ) */
function DisplayWithdrawnCardOnBoard(playerBoard, withDrawnCard, fold) {
    /* Creating New List Element */
    var newLiHolder = document.createElement("li");
    newLiHolder.style.visibility = fold;
    /* Creating Image Element->AddingImage & appending to child */
    var ImgOfCard = document.createElement("IMG");
    ImgOfCard.setAttribute("src", "assets/" + (withDrawnCard.value + '_of_' + withDrawnCard.suit).toLowerCase() + ".png");
    newLiHolder.appendChild(ImgOfCard);
    /* Adding new Li to PlayerBoard */
    playerBoard.appendChild(newLiHolder);
}

/* Player/Dealer Can Withdraw The Card */
function DrawCard() {
    /* Withdraw The Top Card From The Deck*/
    var withDrawnCard = deck[0];
    /* Remove That Card From The deck */
    deck.shift();
    return withDrawnCard;
}

/* Probability Function */
function ComputeProbability() {
    /* I'm Doing Nothing */
    var remScore = 21 - playerScore;
    var failCards = 0;
    deck.forEach(card => failCards += (GetCreditScore(playerScore, card) > remScore) ? 1 : 0);
    var prob = ((1-(failCards/deck.length))*100).toPrecision(2);
    document.getElementById('playerScoreBoard').innerHTML += " @" +prob+"%";
}

/*Blah Blah Conditions For Busting The Player */
function BustThePlayer() {
    if (playerScore > 21)
        DeclarePlayerBusted();
    else if (playerScore === 21)
        DeclarePlayerWin();
}

/* Hit --> Player Withdraws A Card & Check For Bust*/
function HitPlayer(fold = "visible") {
    var withDrawnCard = DrawCard();
    /* Appending the withdraw card image on board */
    var playerBoard = document.getElementById('playerCardsUL');
    DisplayWithdrawnCardOnBoard(playerBoard, withDrawnCard, fold);
    /* Validating and Updating the player Score */
    var creditScore = GetCreditScore(playerScore, withDrawnCard);
    playerScore += creditScore;
    /* Displaying the updated score on ScoreBoard */
    document.getElementById('playerScoreBoard').innerHTML = '' + playerScore;
    /*Bust The Player For Every Move*/
    BustThePlayer();
    /*Compute The Probability For Winning (next move)*/
    ComputeProbability();
}

/*Blah Blah Conditions For Busting The Dealer */
function BustTheDealer() {
    if (dealerScore > 21)
        DeclareDealerBusted();
    else if (dealerScore > playerScore)
        DeclareDealerWin();
    else if (dealerScore < playerScore)
        DeclarePlayerWin();
    else {
        /* Recursion Calls */
        HitDealer();
        BustTheDealer();
    }
}

/* It's Dealer Time Go For Hits */
function Stand() {
    /* Remove The Player Button */
    document.getElementById('hit').remove();
    /* Make The Second Card & Score Values Visible */
    (document.getElementById('dealerCardsUL').childNodes[1]).style.visibility = "visible";
    document.getElementById('dealerScoreBoard').innerHTML = '' + dealerScore;

    /* Check If Score Is Greater Than 17, Then No Need To Go For HitDealer */
    if (dealerScore > 17) {
        if (dealerScore < playerScore)
            DeclarePlayerWin();
        else if (dealerScore > playerScore)
            DeclareDealerWin();
    }
    else
        BustTheDealer();
}

/* Hit --> Dealer Withdraws A Card & Intially Doesn't Go For Bust*/
function HitDealer(fold = "visible") {
    var withDrawnCard = DrawCard();
    /* Appending the withdraw card image on board */
    var dealerBoard = document.getElementById('dealerCardsUL');
    DisplayWithdrawnCardOnBoard(dealerBoard, withDrawnCard, fold);
    /* Validating and Updating the player Score */
    var creditScore = GetCreditScore(dealerScore, withDrawnCard);
    dealerScore += creditScore;
    /* Displaying the updated score on ScoreBoard */
    document.getElementById('dealerScoreBoard').innerHTML = '' + (fold === "hidden") ? dealerScore - creditScore : dealerScore;
}

/* Generating Shuffled Dock @Beginning */
function GetShuffledDeck() {
    /* Create Card Object */
    var suits = ['SPADES', 'HEARTS', 'DIAMONDS', 'CLUBS'];
    ranks = ['ACE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'JACK', 'QUEEN', 'KING'];
    suits.forEach(suit => {
        ranks.forEach(rank => {
            deck.push({
                suit: suit,
                value: rank
            });
        });
    });
    /* Shuffling The Card */
    deck.sort(() => Math.random() - 0.5);
}

function IntializeComponent() {
    /* Generate The Deck */
    GetShuffledDeck()
    /* Intially Hit The Player 2 times */
    HitPlayer(); HitPlayer();
    /* Intially Hit The Dealer 2 times & hide the second card */
    HitDealer(); HitDealer("hidden");
}

function StartGame() {
    IntializeComponent();
    document.getElementById('startGame').style.display = "none";
    document.getElementById('playGame').style.display = "block";
}

