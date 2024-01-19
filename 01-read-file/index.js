const fs = require('fs');
const path = require('path');
let absolutePath = path.join(__dirname, 'text.txt');
let stream = new fs.ReadStream(absolutePath, { encoding: 'utf-8' });
stream.on('readable', function () {
  var data = stream.read();
  if (data != null) {
    console.log(data);
  }
});
