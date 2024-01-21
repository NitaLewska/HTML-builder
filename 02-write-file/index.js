const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });
let writeText = fs.createWriteStream(path.join(__dirname, 'output.txt'), {
  flags: 'a',
});
console.log('Hey, please, help me test this app!');
console.log('Type smth and press "Enter"');
console.log('To exit type "exit" or press Ctrl + C');
rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('Thank you! Have a nice day!');
    rl.close();
  } else {
    writeText.write(`${input}\n`);
  }
});
rl.on('SIGINT', () => {
  console.log('Thank you! Have a nice day!');
  rl.close();
});
