const fs = require('fs');
const path = require('path');
var absolutePath = path.resolve('./01-read-file/text.txt');
var stream = new fs.ReadStream(absolutePath, { encoding: 'utf-8' });
stream.on('readable', function () {
  var data = stream.read();
  console.log(data);
});
