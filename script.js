const wordLength = 5;
const guesses = 6;
let winWord = "";
let boardData = [];
let dictionary = [];

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

function addWord(enteredWord) {

	enteredWord = enteredWord.toUpperCase();

	// creates a new array to store the data
	let wordData = [];
	let win = true;

	// loops through each letter in the word
	for (let i = 0; i < wordLength; i++) {

		// adds letter to the list, assumes it is a "gray" word
		wordData.push([enteredWord[i], 0])

		// loops through each letter in the winWord
		for (let j = 0; j < wordLength; j++) {

			// checks for a "yellow" word
			if (enteredWord[i] == winWord[j]) {
				wordData[i][1] = 1;
			}
		}

		// checks for a "green" word
		if (enteredWord[i] == winWord[i]) {
			wordData[i][1] = 2;
		} else {
			win = false;
		}
	}
	boardData.push(wordData);

	if (win) {
		console.log("you won!")
	} else if (win == false && boardData.length == guesses) {
		console.log("you lost :(")
	} else {
		console.log("try again...")

	}
}

function updateBoard() {
	for (let i = 0; i < boardData.length; i++) {
		for (let j = 0; j < wordLength; j++) {
			$("#"+i+"-"+j).text(boardData[i][j][0])

			if (boardData[i][j][1] == 0) {
				$("#"+i+"-"+j).css("background-color", "rgb(48, 48, 48);")
			} else if (boardData[i][j][1] == 1) {
				$("#"+i+"-"+j).css("background-color", "#5a5e12")
			} else if (boardData[i][j][1] == 2) {
				$("#"+i+"-"+j).css("background-color", "#0b4f0a")
			}
		}
	}
}

function displayMessage(text="", error=false) {
	$("#message").text(text);

	if (error) {
		$("#message").css("color", "rgb(255, 129, 129)")
	} else {
		$("#message").css("color", "lightgray")
	}
}

async function getDictionary() {
	try {
		const response = await fetch("/words/" + wordLength + "-letter-words.json");
		dictionary = await response.json();
	} catch {
		displayMessage("Error: could not fetch dictionary.", true)
	}
}

async function pickWord() {
	if (dictionary.length == 0) {
		await getDictionary();
		await pickWord();
	} else {
		winWord = dictionary[Math.floor(Math.random()*dictionary.length)].toUpperCase();
	}
}

function validWord(word) {
	return dictionary.includes(word.toLowerCase())
}

$("#enterButton").click( function() {
	
	const input = $("#wordInput").val();
	$("#wordInput").val("");

	if (input.length != wordLength) {
		displayMessage("Word must be " + wordLength + " letters long.", true)
	} else if (dictionary.includes(input.toLowerCase())) {
		displayMessage();
		addWord(input);
		updateBoard();
	} else {
		displayMessage("Word not found in dictionary.", true);
	}

	if (input.toUpperCase() == winWord) {
		if (boardData.length == 1) {
			displayMessage(`You won! You guessed the wordle in 1 try!`)
		} else {
			displayMessage(`You won! You guessed the wordle in ${boardData.length} tries!`)
		}
		$('#enterButton').prop('disabled', true)
	} else if (boardData.length >= 6) {
		displayMessage(`You lost. The wordle was ${winWord.toLowerCase()}.`)
		$('#enterButton').prop('disabled', true)
	}
});

createBoard();
pickWord();