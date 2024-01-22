const fs = require('fs');
const path = require('path');
let writeText = fs.createWriteStream(
  path.join(__dirname, '/project-dist', 'bundle.css'),
  {
    flags: 'w',
  },
);
fs.readdir(
  path.join(__dirname, '/styles'),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        if (file.name.endsWith('.css') && file.isFile()) {
          fs.readFile(
            path.join(__dirname, '/styles', file.name),
            (err, data) => {
              if (err) throw err;
              writeText.write(data.toString());
              writeText.write('\n');
            },
          );
        }
      });
    }
  },
);
