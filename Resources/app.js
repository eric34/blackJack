// make a window
var win = Ti.UI.createWindow({
	layout : 'vertical',
	backgroundColor : 'white'

});

// Get the images from the filesystem
var clubImage = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, '/images/club.png');
var heartImage = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, '/images/heart.png');
var diamondImage = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, '/images/diamond.png');
var spadeImage = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, '/images/spade.png');

// Make some buttons for the UI
var hitButton = Ti.UI.createButton({
	height : 40,
	width : 100,
	bottom : 0,
	title : 'hit'
});

var standButton = Ti.UI.createButton({
	height : 40,
	width : 100,
	bottom : 0,
	title : 'stand'
});

hitButton.addEventListener('click', function() {
	hit();
});

standButton.addEventListener('click', function() {
	stand();
});

// Make a couple views to seperate the card dealing area
var dealerView = Ti.UI.createView({
	layout : 'horizontal',
	backgroundColor : 'green',
	height : '50%'
});

var dealerScore = Ti.UI.createLabel({
	text : '0',
	left : 5,
	height : 36,
	textAlign : 'center'
});

dealerView.add(dealerScore);

var playerView = Ti.UI.createView({
	layout : 'horizontal',
	backgroundColor : 'yellow',
	height : '50%'
});

var playerScore = Ti.UI.createLabel({
	text : '0',
	left : 5,
	height : 36,
	textAlign : 'center'
});

playerView.add(playerScore);

var firstCard = Ti.UI.createView({
	layout : 'vertical',
	borderRadius : 5,
	borderColor : 'black',
	borderWidth : 3,
	backgroundColor : 'white',
	left : 10,
	top : 40,
	height : 180,
	width : 120
});
var secondCard = Ti.UI.createView({
	layout : 'vertical',
	borderRadius : 5,
	borderColor : 'black',
	borderWidth : 3,
	backgroundColor : 'white',
	left : 10,
	top : 40,
	height : 180,
	width : 120
});

var label1 = Titanium.UI.createLabel({
	id : 'font_label_test',
	text : 'A',
	left : 5,
	height : 36,
	textAlign : 'center'
});

var label2 = Titanium.UI.createLabel({
	id : 'font_label_test',
	text : 'K',
	left : 5,
	height : 36,
	textAlign : 'center'
});

var pCard1 = Ti.UI.createImageView({
	backgroundColor : 'white',
	image : spadeImage
});
var pCard2 = Ti.UI.createImageView({
	backgroundColor : 'white',
	image : heartImage
});


firstCard.add(label1);
firstCard.add(pCard1);

secondCard.add(label2);
secondCard.add(pCard2);

dealerView.add(firstCard);
dealerView.add(secondCard);


dealer_hand = new Array();
player_hand = new Array();
var game_over = false;

// Constructor for Card objects
function Card(num, suit) {
	this.num = num;
	this.suit = suit;
	this.fname = fname;

}

function fname() {
	return this.num + this.suit + ".png";
}

// The function fname() makes a filename for an image.
// The filenames are a concatenation of card number and suit
// Ace = 1 and King = 13

// Constructor for Deck Object
function Deck() {
	this.cards = new Array(52);
	this.next_card = 0;
	// fill the deck (in order, for now)
	for ( i = 1; i < 14; i++) {
		this.cards[i - 1] = new Card(i, "c");
		this.cards[i + 12] = new Card(i, "h");
		this.cards[i + 25] = new Card(i, "s");
		this.cards[i + 38] = new Card(i, "d");
	}
	this.shuffle = shuffle;
	this.dealCard = dealCard;
}

function shuffle() {
	Ti.API.info("Shuffling");

	for ( i = 1; i < 1000; i++) {
		// switch two randomly selected cards
		card1 = Math.floor(52 * Math.random());
		card2 = Math.floor(52 * Math.random());
		temp = this.cards[card2];
		this.cards[card2] = this.cards[card1];
		this.cards[card1] = temp;
	}
	this.next_card = 0;
}

// This deals the next card off the deck
function dealCard() {
	Ti.API.info("dealing");

	return this.cards[this.next_card++];
}

// this makes a new deck and shuffles it
var deck = new Deck();
deck.shuffle();

// The display function
function displayCard(player, card, up) {
	if (player === "player") {

	}

}

// The main loop, slowly converting from a javascript web page
function newGame() {

	Ti.API.info("In new Game");

	if (deck.next_card > 39) {// shuffle the deck if 75% of
		deck.shuffle();
		// the cards have been used.
	}

	// make an array for each hand
	dealer_hand = new Array();
	player_hand = new Array();

	// player gets one up first, then dealer down, then player up, then dealer up
	player_hand[0] = deck.dealCard();
	displayCard('player', player_hand[0], true);

	dealer_hand[0] = deck.dealCard();
	// This is the hole card.
	displayCard('dealer', dealer_hand[0], false);

	player_hand[1] = deck.dealCard();
	displayCard('player', player_hand[1], true);

	dealer_hand[1] = deck.dealCard();
	displayCard('dealer', dealer_hand[1], true);
	
	//add up the score
	playerScore.text = score(player_hand);
	dealerScore.text = score(dealer_hand);

	//Some logging to check my display
	Ti.API.info("hit the first deal");
	Ti.API.info("Dealer first card is a " + dealer_hand[0].num + " " + dealer_hand[0].suit);
	Ti.API.info("Dealer Second is a " + dealer_hand[1].num + " " + dealer_hand[1].suit);
	Ti.API.info("Player first card is a " + player_hand[0].num + " " + player_hand[0].suit);
	Ti.API.info("Player Second is a " + player_hand[1].num + " " + player_hand[1].suit);

	label1.text = dealer_hand[0].num;
	label2.text = dealer_hand[1].num;

	if (dealer_hand[0].suit == 'h') {
		pCard1.image = heartImage;
	} else if (dealer_hand[0].suit == 's') {
		pCard1.image = spadeImage;

	} else if (dealer_hand[0].suit == 'd') {
		pCard1.image = diamondImage;
	} else {
		pCard1.image = clubImage;
	}

	if (dealer_hand[1].suit == 'h') {
		pCard2.image = heartImage;
	} else if (dealer_hand[1].suit == 's') {
		pCard2.image = spadeImage;

	} else if (dealer_hand[1].suit == 'd') {
		pCard2.image = diamondImage;
	} else {
		pCard2.image = clubImage;
	}

	win.add(dealerView);
	win.add(playerView);
	
	// document.images[0].src = "blank.gif"; // The hole card is not shown
	// dealer_hand[ 1 ] = deck.dealCard();
	// document.images[ 1 ].src = dealer_hand[ 1 ].fname();
	// for ( i=2; i<6; i++) {
	// document.images[i].src = "blank.gif";
	// }
	//
	// player_hand[ 0 ] = deck.dealCard();
	// document.images[ 6 ].src = player_hand[ 0 ].fname();
	// player_hand[ 1 ] = deck.dealCard();
	// document.images[ 7 ].src = player_hand[ 1 ].fname();
	// for (i=8; i<12; i++) {
	// document.images[i].src = "blank.gif";
	// }
	// //end the old way


	// // Reset the form fields and the state variables
	// window.status = "";
	// document.form1.dealer.value = "";
	// document.form1.result.value = "";
	// document.form1.player.value = score( player_hand );
	game_over = false;

}// end function newGame()

function hit() {
	var total = 0;
	var new_card = 0;
	// index for the new card position
	if (game_over) {
		alert("Game over.  Click the Deal button to start a new hand.");
	} else {
		new_card = player_hand.length;
		player_hand[new_card] = deck.dealCard();
		//document.images[new_card + 6].src = player_hand[new_card].fname();
		total = score(player_hand);
		playerScore.text = total;
		
		if (total > 21) {// Busted, game over.
			alert("  busted");
			//document.images[0].src = dealer_hand[0].fname();
			// reveal the dealer hole card
			//document.form1.dealer.value = score(dealer_hand);
			winner();
			game_over = true;
		} else {
			//document.form1.player.value = total;
		}
	}
}// end function hit()

function stand() {
	var total = 0;
	var new_card = 0;
	// index for the new card position
	if (game_over) {
		//window.status = "Game over.  Click the Deal button to start a new hand."
	} else {

		// document.images[ 0 ].src = dealer_hand[ 0 ].fname(); // reveal the dealer hole card
		while (score(dealer_hand) < 17) {// Dealer stands on soft 17
			dealerScore.text = score(dealer_hand);
			
			new_card = dealer_hand.length;
			dealer_hand[new_card] = deck.dealCard();
			//  document.images[ new_card ].src = dealer_hand[ new_card ].fname();
		}

		total = score(dealer_hand);
		if (total > 21) {// Busted
			dealerScore.text = score(dealer_hand);
			alert('dealer busted');
		} else {
			dealerScore.text = score(dealer_hand);
		}

	}
	winner();
	game_over = true;
	// The game ends after the player stands.

}// end function stand()

function score(hand) {
	var total = 0;
	var soft = 0;
	// This variable counts the number of aces in the hand.
	var pips = 0;
	// The trump pictures on a card used to be called pips.
	for ( i = 0; i < hand.length; i++) {
		pips = hand[i].num;
		if (pips == 1) {
			soft = soft + 1;
			total = total + 11;
		} else {
			if (pips == 11 || pips == 12 || pips == 13) {
				total = total + 10;
			} else {
				total = total + pips;
			}
		}
	}
	while (soft > 0 && total > 21) {// Count the aces as 1 instead
		total = total - 10;
		// of 11 if the total is over 21
		soft = soft - 1;
	}
	return total;
}// end function score

function winner() {
	var player_total = score(player_hand);
	var dealer_total = score(dealer_hand);
	if (player_total > 21) {// Busted
		// document.form1.result.value = "Dealer wins";
	} else {
		if (dealer_total > 21) {// Busted
			//document.form1.result.value = "Player wins";
		} else {
			if (player_total == dealer_total) {
				// document.form1.result.value = "Tie game";
			} else {
				if (player_total > dealer_total) {
					// document.form1.result.value = "Player wins";
				} else {
					//  document.form1.result.value = "Dealer wins";
				}
			}
		}
	}
}

// Make some buttons for the UI
var hitButton = Ti.UI.createButton({
	height : 40,
	width : 100,
	bottom : 0,
	title : 'hit'
});

var standButton = Ti.UI.createButton({
	height : 40,
	width : 100,
	bottom : 0,
	title : 'stand'
});

hitButton.addEventListener('click', function() {
	hit();
});

standButton.addEventListener('click', function() {
	stand();
});

playerView.add(hitButton);
playerView.add(standButton);

win.open();
newGame();
