function startGame() { //function to start the game
  const startCircle = document.getElementById('startSign'); // gets the red button to indicate when game start
  startCircle.style.backgroundColor = "red"; //ensures red button is red when game start
  canClick = false; //ensures user cannot click anything
  clearTimeout(responseTimeout); // ensures timer is reset when game start


  sequence.length = 0;  // ensures sequence is empty before start
  sequence.push(getRandomPanel()); //inserts random panel into sequence
  sequenceToGuess = [...sequence]; // sets the sequence to guess = to the current sequence
  currentScore = 0; //reset the score to 0
  document.querySelector(".score").textContent = '00'; //reset the score back to 00
  canClick = false;  // ensure user cannot click

  
  setTimeout(function() { // set a timeout for 3000ms eg 3 seconds
    startCircle.style.backgroundColor = "green"; //set the button to green to show start
    startFlashing(); //start the sequence flashing
  }, 3000); 
}


let responseTimeout; //initialise the response timeout

const startFlashing = async () => { // the start flashing sequence
  canClick = false; // ensure user cannot click
  for (const panel of sequence) { // for all the panels in the sequence flash them
    await flash(panel); // flash the panel
  }
  canClick = true; // ensure user can click

  
  clearTimeout(responseTimeout);  //clear the reponseTimeout
  responseTimeout = setTimeout(() => { // set timeout for 5 seconds
    flashAllButtons().then(() => { // flash all buttons
      alert('Too slow! Game over!'); // display failure message
    });
  startGame(); // start game again after 5 seconds
}, 5000); 
};



const flashAllButtons = () => { // flash all buttons function
  return new Promise((resolve) => { //promise to ensure user succeeds or fails
    let count = 0; // set count to 0
    const interval = setInterval(() => { // set interval to display all the panels every 250ms
      greenButton.classList.toggle('active'); //toggle  buttons
      redButton.classList.toggle('active');//toggle  buttons
      blueButton.classList.toggle('active');//toggle  buttons
      yellowButton.classList.toggle('active');//toggle  buttons

      count++; // increase count
      if (count === 10) { // if count is 10 the interval is cleared
        clearInterval(interval); // clear the interval
        resolve(); 
      }
    }, 250); // 250 ms interval
  });
};





const greenButton = document.querySelector('.green'); // gets the green button in a variable
const redButton = document.querySelector('.red'); // gets the red button in a variable
const blueButton = document.querySelector('.blue'); // gets the blue button in a variable
const yellowButton = document.querySelector('.yellow'); // gets the yellow button in a variable

const greenSound = new Audio('sounds/green.mp3'); // gets audio for green button
const redSound = new Audio('sounds/red.mp3');// gets audio for red button
const blueSound = new Audio('sounds/blue.mp3');// gets audio for blue button
const yellowSound = new Audio('sounds/yellow.mp3');// gets audio for yellow button

greenButton.addEventListener('click', () => { // event listener to detect click and play sound
  greenSound.play(); //play sound
});
redButton.addEventListener('click', () => {// event listener to detect click and play sound
 redSound.play(); //play sound
});
blueButton.addEventListener('click', () => {// event listener to detect click and play sound
  blueSound.play(); //play sound
});
yellowButton.addEventListener('click', () => {// event listener to detect click and play sound
  yellowSound.play(); //play sound
});




const getRandomPanel = () => { // function to pick a random panel
  const panels = [ // all the panels
    greenButton, // green panel
    redButton, // red panel
    blueButton, // blue panel
    yellowButton //yellow panel
  ];
  return panels[parseInt(Math.random()* panels.length)]; // return panel that is found by getting random maths number between 0-1 and mutliplying by 4 panels and making integer
}

const sequence = [ //the sequence
  getRandomPanel() //get a random panel 
];


let sequenceToGuess = [...sequence]; // makes the sequence to guess the current sequence


const flash = panel => { //flash the panels
  let flashDuration = 1000; // Default flash duration

  
  if (currentScore <= 5) { //if score less or equal to 5 duration is 750ms
    flashDuration = 750;
  } else if (currentScore <= 9) { //if score less or equal to 9 duration is 500ms
    flashDuration = 500;
  } else if (currentScore <= 13) { //if score less or equal to 13 duration is 250ms
    flashDuration = 250;
  }

  return new Promise((resolve, reject) => { // makes promise 
    let sound; // initialise sound
    if (panel === greenButton) sound = greenSound; //play green sound if green
    else if (panel === redButton) sound = redSound;//play red sound if red
    else if (panel === blueButton) sound = blueSound;//play blue sound if blue
    else if (panel === yellowButton) sound = yellowSound;//play yellow sound if yellow

    sound.play();  // Play the sound
   
    panel.classList.add('active'); // Flashes colour by making active
    setTimeout(() => { //set timeout of flashduration which depends on current score
      panel.classList.remove('active'); // Unflash colour
      setTimeout(() => { // set timeout for 250ms to stop instant flashes
        resolve(); //resolve
      }, 250);
    }, flashDuration); // Depending on current score, its sets the delay between sequence
  });
};




let canClick = false; // ensures user cant click
let currentScore = 0; // creates the currentscore
let highScore = currentScore; // set the highScore equal to currentscore

const panelClicked = panelClicked => { // function for panel clicked by user
  if (!canClick) return; // Ensures user can't click if not allowed
  const expectedPanel = sequenceToGuess.shift(); // Removes panel from sequence if guessed
  if (expectedPanel === panelClicked) { // If the guess matches
    if (sequenceToGuess.length === 0) { // If the sequence length = 0, wins round
      sequence.push(getRandomPanel()); // Add new panel to sequence
      sequenceToGuess = [...sequence]; // Changes the new sequence to guess
      currentScore++; // Increment the score
      if (highScore < currentScore) {
        highScore = currentScore; // Updates the high score
      }
      document.querySelector(".score").textContent = currentScore.toString(); // Update the score display
      document.querySelector(".highScore").textContent = highScore.toString(); // Update the high score display
      clearTimeout(responseTimeout); // Clear the "Too slow" timeout
      startFlashing(); // Start flashing the new sequence including the new panel
    }
  } else {
    clearTimeout(responseTimeout); // Clear the "Too slow" timeout on wrong answer
    flashAllButtons().then(() => { // flash panels again for wrong answers
      setTimeout(() => { // set timeout of 1 second
        alert('Game over!'); // Show game over alert
        startGame(); // Restart the game
      }, 1000); // Delay to ensure the flashAllButtons animation can be seen
    });
  }
};


