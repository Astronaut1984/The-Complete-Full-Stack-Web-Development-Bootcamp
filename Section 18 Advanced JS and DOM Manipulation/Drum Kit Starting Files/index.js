document.addEventListener("keydown", handleClick);
buttons = document.querySelectorAll(".drum");
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", handleClick);
}

function handleClick(event) {
  let buttonText = "";
  if (event.type == "click") {
    buttonText = this.textContent;
  } else {
    buttonText = event.key;
  }

  buttonText = buttonText.toLowerCase();

  switch (buttonText) {
    case "w":
      let tom1 = new Audio("./sounds/tom-1.mp3");
      tom1.play();
      break;
    case "a":
      let tom2 = new Audio("./sounds/tom-2.mp3");
      tom2.play();
      break;
    case "s":
      let tom3 = new Audio("./sounds/tom-3.mp3");
      tom3.play();
      break;
    case "d":
      let tom4 = new Audio("./sounds/tom-4.mp3");
      tom4.play();
      break;
    case "j":
      let crash = new Audio("./sounds/crash.mp3");
      crash.play();
      break;
    case "k":
      let kick = new Audio("./sounds/kick-bass.mp3");
      kick.play();
      break;
    case "l":
      let snare = new Audio("./sounds/snare.mp3");
      snare.play();
      break;
    default:
      console.log(buttonText);
      break;
  }

  addAnimation(buttonText);
}

function addAnimation(currKey) {
  let buttonPressed = document.querySelector("." + currKey);
  buttonPressed.classList.add("pressed");
  setTimeout(function () {
    buttonPressed.classList.remove("pressed");
  }, 100);
}
