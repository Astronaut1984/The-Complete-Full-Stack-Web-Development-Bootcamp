$("button").on("click", function () {
  $("h1").css("color", "purple");
});

$(document).on("keydown", function (event) {
  let text = $("h1").text();
  $("h1").text(text + event.key);
});
