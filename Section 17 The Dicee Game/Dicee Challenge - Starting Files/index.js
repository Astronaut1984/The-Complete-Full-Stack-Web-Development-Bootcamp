let button = document.querySelector(".dice_roller");
button.addEventListener("click", roll_dice);

async function roll_dice() {
  let dice1 = document.querySelector(".img1");
  let dice2 = document.querySelector(".img2");

  let rng1 = Math.floor(Math.random() * 6) + 1;
  let rng2 = Math.floor(Math.random() * 6) + 1;

  for (let i = 0; i < 10; i++) {
    rng1 = Math.floor(Math.random() * 6) + 1;
    rng2 = Math.floor(Math.random() * 6) + 1;

    dice1.setAttribute("src", "./images/dice" + rng1 + ".png");
    dice2.setAttribute("src", "./images/dice" + rng2 + ".png");

    await new Promise((r) => setTimeout(r, 100));
  }

  let winner = rng1 > rng2 ? "Player 1" : rng2 > rng1 ? "Player 2" : "Tie";

  let winnerScreen = document.querySelector(".winner");
  console.log(winnerScreen);
  winnerScreen.style.visibility = "visible";
  winnerScreen.textContent = "Winner: " + winner;
}
