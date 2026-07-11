/**
 *
 * @param {HTMLElement} btn
 * @param {String} correct
 */
function checkAnswer(btn, correct) {
  if (btn.classList.contains("bg-success")) {
    btn.classList.remove("bg-success");
    btn.classList.remove("text-light");
    return;
  }
  if (btn.classList.contains("bg-danger")) {
    btn.classList.remove("bg-danger");
    btn.classList.remove("text-light");
    return;
  }
  btn.classList.add("text-light");
  if (btn.value.toLowerCase() == correct.toLowerCase()) {
    btn.classList.add("bg-success");
  } else {
    btn.classList.add("bg-danger");
  }
}
