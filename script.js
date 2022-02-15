const wordLength = 5;
const guesses = 6;
let winWord = "";
let boardData = [];
let dictionary = [];

let dictionaries = {
	win: [],
	guess: [],
};

async function fetchDictionaries() {
	try {
		for (dictionary in dictionaries) {
			const response = await fetch(
				"words/" + dictionary + "Dictionary.json"
			);
			dictionaries[dictionary] = await response.json();
		}
		winWord = dictionaries.win[Math.floor(Math.random()*dictionaries.win.length)].toUpperCase();
	} catch {
		displayMessage(
			"ERROR: Could not fetch Dictionaries. Refresh the page to try again.",
			true
		);
	}
}
fetchDictionaries();

function createBoard() {
	// repeat for each allowed guess
	for (let i = 0; i < guesses; i++) {
		// make a new word element
		const newWord = document.createElement("div");
		newWord.classList = "word";

		// repeat for each letter in the word
		for (let j = 0; j < wordLength; j++) {
			// make a new tile element and add it to the new word
			const newTile = document.createElement("div");
			newTile.classList = "tile";
			newTile.id = i + "-" + j;
			newWord.append(newTile);
		}

		// add the new word to the board element
		$(".board").append(newWord);
	}
}
createBoard();

// Basically the wordle algorithm
function addWord(guess) {
	guess = guess.toUpperCase();

	// array of arrays
	// each subarray has letter and "color" int value
	// gray = 0, yellow = 1, green = 2
	let guessArray = [];

	// array of arrays
	// each subarry has letter and used boolean value
	// false = not used yet, true = used
	let winArray = [];

	for (let i = 0; i < wordLength; i++) {
		guessArray.push([guess[i], 0]); // assume all guess letters are gray
		winArray.push([winWord[i], false]); // assume all win letters haven't been used
	}

	// check each letter for green
	for (let i = 0; i < wordLength; i++) {
		if (guessArray[i][0] == winArray[i][0]) {
			guessArray[i][1] = 2; // set the current guess letter to green
			winArray[i][1] = true; // set the win letter as having been used
		}
	}

	// check each letter for yellow if not green
	for (let i = 0; i < wordLength; i++) {
		if (guessArray[i][1] != 2) {
			for (let j = 0; j < wordLength; j++) {
				if (
					guessArray[i][0] == winArray[j][0] && // if they're the same letter AND ...
					winArray[j][1] == false // ... AND if they haven't been used
				) {
					guessArray[i][1] = 1; // set the current guess letter to yellow
					winArray[j][1] = true; // set the win letter as having been used
					break; // don't keep comparing if just determined to be yellow
				}
			}
		}
	}

	boardData.push(guessArray);
}

function updateBoard() {
	for (let i = 0; i < boardData.length; i++) {
		for (let j = 0; j < wordLength; j++) {
			$("#" + i + "-" + j).text(boardData[i][j][0]);

			if (boardData[i][j][1] == 0) {
				$("#" + i + "-" + j).css(
					"background-color",
					"rgb(48, 48, 48);"
				);
			} else if (boardData[i][j][1] == 1) {
				$("#" + i + "-" + j).css("background-color", "#5a5e12");
			} else if (boardData[i][j][1] == 2) {
				$("#" + i + "-" + j).css("background-color", "#0b4f0a");
			}
		}
	}
}

function displayMessage(text = "", error = false) {
	$("#message").text(text);
	console.log(text);

	if (error) {
		$("#message").css("color", "rgb(255, 129, 129)");
	} else {
		$("#message").css("color", "lightgray");
	}
}

$("#enterButton").click(function () {
	const input = $("#wordInput").val();
	$("#wordInput").val("");

	if (input.length != wordLength) {
		displayMessage("Word must be " + wordLength + " letters long.", true);
	} else if (dictionaries.guess.includes(input.toLowerCase())) {
		displayMessage();
		addWord(input);
		updateBoard();
	} else {
		displayMessage("Word not found in dictionary.", true);
	}

	if (input.toUpperCase() == winWord) {
		if (boardData.length == 1) {
			displayMessage(
				`You won! You guessed the wordle in 1 try! Refresh to play again.`
			);
		} else {
			displayMessage(
				`You won! You guessed the wordle in ${boardData.length} tries! Refresh to play again.`
			);
		}
		$("#enterButton").prop("disabled", true);
	} else if (boardData.length >= 6) {
		displayMessage(
			`You lost. The wordle was ${winWord.toLowerCase()}. Refresh to play again.`
		);
		$("#enterButton").prop("disabled", true);
	}
});

console.log("Having trouble? Type \"winWord\" into the console to see the answer.")