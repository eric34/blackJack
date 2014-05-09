// make a window
var win = Ti.UI.createWindow({
	layout : 'vertical',
	backgroundColor : 'white'

});

// define some globals
var game_over = false;

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

var dealButton = Ti.UI.createButton({
	height : 40,
	width : 100,
	bottom : 0,
	title : 'deal'
});

hitButton.addEventListener('click', function() {
	hit();
});

standButton.addEventListener('click', function() {
	stand();
});

dealButton.addEventListener('click', function() {
	newHand();
});

// Make a couple views to seperate the card dealing area
var dealerView = Ti.UI.createView({
	layout : 'horizontal',
	backgroundColor : '#666',
	height : '45%'
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
	backgroundColor : '#999',
	height : '45%'
});

var playerScore = Ti.UI.createLabel({
	text : '0',
	left : 5,
	height : 36,
	textAlign : 'center'
});

playerView.add(playerScore);

var chipView = Ti.UI.createView({
	layout : 'horizontal',
	backgroundColor : 'white',
	height : '10%'
});

// Constructor for Card objects with images as objects
function Card(num, suit, img) {
	this.num = num;
	this.suit = suit;
	this.img = img;
}

// my function for making and returning the card image object
function buildCard(cardNumber, image) {
	var cardView = Ti.UI.createView({
		layout : 'vertical',
		borderRadius : 5,
		borderColor : 'black',
		borderWidth : 3,
		backgroundColor : 'white',
		left : 10,
		top : 40,
		height : 90,
		width : 60
	});

	var cardLabel = Titanium.UI.createLabel({
		id : 'font_label_test',
		text : cardNumber,
		left : 5,
		height : 36,
		textAlign : 'center'
	});

	var suitImage = Ti.UI.createImageView({
		backgroundColor : 'white',
		width : 25,
		height : 25,
		image : image
	});

	if (cardNumber === 1 || cardNumber > 10) {
		switch(cardNumber) {
			case 1:
				cardLabel.text = 'A';
				break;
			case 11:
				cardLabel.text = 'J';
				break;
			case 12:
				cardLabel.text = 'Q';
				break;
			case 13:
				cardLabel.text = 'K';
				break;
			default:
				cardLabel.text = '#';
				break;
		}
	} else {
		cardLabel.text = cardNumber;
	}
	cardView.add(cardLabel);
	cardView.add(suitImage);
	return cardView;
}

//Constructor for hole card object
function holeCard() {
	return Ti.UI.createView({
		layout : 'vertical',
		borderRadius : 5,
		borderColor : 'black',
		borderWidth : 3,
		backgroundColor : 'blue',
		left : 10,
		top : 40,
		height : 90,
		width : 60
	});
}

// Constructor for Deck Object
function Deck() {
	this.cards = new Array(52);
	this.next_card = 0;
	// fill the deck (in order, for now)
	for ( i = 1; i < 14; i++) {
		//I added images here
		this.cards[i - 1] = new Card(i, "c", buildCard(i, clubImage));
		//called a function
		this.cards[i + 12] = new Card(i, "h", buildCard(i, heartImage));
		this.cards[i + 25] = new Card(i, "s", buildCard(i, spadeImage));
		this.cards[i + 38] = new Card(i, "d", buildCard(i, diamondImage));
	}
	this.shuffle = shuffle;
	this.dealCard = dealCard;
}

// this function shuffles the deck
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

// the backup display function when stuff goes to hell
function displayCard(player, card, up) {

	if (player === 'player') {
		playerView.add(card.img);

	} else {
		if (!up) {
			dealerView.add(holeCard());
		} else {
			dealerView.add(card.img);
		}
	}

};

// The main loop, slowly converting from a javascript web page
function newGame() {

	Ti.API.info("In new Game");

	if (deck.next_card > 39) {
		deck.shuffle();
		// shuffle the deck if 75% of
		// the cards have been used.
	}

	// make an array for each hand
	dealer_hand = new Array();
	player_hand = new Array();

	// player gets one up first, then dealer down, then player up, then dealer up
	player_hand[0] = deck.dealCard();
	displayCard('player', player_hand[0], true);
	Ti.API.info("Player first card is a " + player_hand[0].num + " " + player_hand[0].suit);

	dealer_hand[0] = deck.dealCard();
	// This is the hole card.
	displayCard('dealer', dealer_hand[0], false);
	Ti.API.info("Dealer first card is a " + dealer_hand[0].num + " " + dealer_hand[0].suit);

	player_hand[1] = deck.dealCard();
	displayCard('player', player_hand[1], true);
	Ti.API.info("Player Second is a " + player_hand[1].num + " " + player_hand[1].suit);

	dealer_hand[1] = deck.dealCard();
	displayCard('dealer', dealer_hand[1], true);
	Ti.API.info("Dealer Second is a " + dealer_hand[1].num + " " + dealer_hand[1].suit);

	//add up the score
	playerScore.text = score(player_hand);
	dealerScore.text = score(dealer_hand);

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
		displayCard('player', player_hand[new_card], true);
		Ti.API.info("Player " + new_card + " is a " + player_hand[new_card].num + " " + player_hand[new_card].suit);
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

function newHand() {
	for (var i = 0; i < dealer_hand.length; i++) {
		dealerView.remove(dealer_hand[i].img);
	}
	for (var i = 0; i < player_hand.length; i++) {
		playerView.remove(player_hand[i].img);
	}
	newGame();

}

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
		alert('Dealer Wins');
	} else {
		if (dealer_total > 21) {// Busted
			alert("Player wins");
		} else {
			if (player_total == dealer_total) {
				alert("Push");
			} else {
				if (player_total > dealer_total) {
					alert("Player wins");
				} else {
					alert("Dealer wins");
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

chipView.add(hitButton);
chipView.add(standButton);
chipView.add(dealButton);

win.add(dealerView);
win.add(playerView);
win.add(chipView);

win.open();
newGame();
