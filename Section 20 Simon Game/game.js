let gamePattern = [];
let userClickedPattern = [];
let buttonColors = ["red", "blue", "green", "yellow"];

function nextSequence() {
  if (!started) {
    started = true;
    $(document).off("keydown");
  }
  level++;
  $("#level-title").text("Level " + level);
  let colorIdx = Math.floor(Math.random() * 4);
  let userChosenColour = buttonColors[colorIdx];
  gamePattern.push(userChosenColour);
  $("#" + userChosenColour)
    .fadeOut(70)
    .fadeIn(70);
  playSound(userChosenColour);
}

async function reset() {
  started = false;
  gamePattern = [];
  userClickedPattern = [];
  $("body").addClass("game-over");
  $("h1").text("Game Over, Press Any Key to Restart");
  playSound("wrong");
  await new Promise((r) => setTimeout(r, 100));
  $("body").removeClass("game-over");
  level = 0;
  $(document).on("keydown", nextSequence);
}

function buttonClicked() {
  if (started) {
    let userChosenColour = this.id;
    animatePress(userChosenColour);
    playSound(userChosenColour);
    userClickedPattern.push(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
  }
}

function playSound(name) {
  let buttonSound = new Audio("./sounds/" + name + ".mp3");
  buttonSound.play();
}

async function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  await new Promise((r) => setTimeout(r, 100));
  $("#" + currentColor).removeClass("pressed");
}

async function checkAnswer(currentLevel) {
  console.log(userClickedPattern);
  console.log(gamePattern);
  if (gamePattern[currentLevel] == userClickedPattern[currentLevel]) {
    console.log("success");
    if (gamePattern.length == userClickedPattern.length) {
      userClickedPattern.splice(0, userClickedPattern.length);
      await new Promise((r) => setTimeout(r, 1000));
      nextSequence();
    }
  } else {
    reset();
    console.log("wrong");
  }
}

$(".btn").on("click", buttonClicked);
$(document).on("keydown", nextSequence);

let level = 0;
started = false;

// let randomNumber = nextSequence();
// let randomChosenColor = buttonColors[randomNumber];
// gamePattern.push(randomChosenColor);

// let chosenButton = $("#" + randomChosenColor);
// chosenButton.on("click", function () {
//   chosenButton.fadeOut(70).fadeIn(70);
//   let buttonSound = new Audio("./sounds/" + randomChosenColor + ".mp3");
//   buttonSound.play();
// });
