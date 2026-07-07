const fs = require("fs");

// fs.writeFile("message.txt", "Hello George", (err) => {
//   if (err) throw err;
//   console.log("The file has been saved!");
// });

fs.readFile("message.txt", "utf-8", function (err, data) {
  if (err) throw err;
  console.log(data);
});
