const fs = require('fs');
const path = require('path');
fs.readdir(
  path.join(__dirname, '/secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    else {
      console.log('\nCurrent directory filenames:');
      files.forEach((file) => {
        if (file.isFile()) {
          fs.stat(
            path.join(__dirname, '/secret-folder', file.name),
            (err, stats) => {
              let [fileName, fileExtension] = file.name.split('.');
              console.log(
                `${fileName} - ${fileExtension} - ${stats.size} bytes`,
              );
            },
          );
        }
      });
    }
  },
);
