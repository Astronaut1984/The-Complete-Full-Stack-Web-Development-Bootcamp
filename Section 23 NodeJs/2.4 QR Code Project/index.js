/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

import { writeFile, createWriteStream } from "fs";
import { image, imageSync } from "qr-image";
import inquirer from "inquirer";

// 1. Use the inquirer npm package to get user input.
const answers = await inquirer.prompt([
  {
    type: "input",
    name: "link",
    message: "Enter the link:",
  },
]);

const answer = answers["link"];

// 2. Use the qr-image npm package to turn the user entered URL into a QR code image.
const qr_image = image(answer);
qr_image.pipe(createWriteStream("qr_image_george.png"));

// 3. Create a txt file to save the user input using the native fs node module.
writeFile("URL_GEORGE.txt", answer, function (err) {
  if (err) throw err;
  console.log("The file has been saved!");
});
