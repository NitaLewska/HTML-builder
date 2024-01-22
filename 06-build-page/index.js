const fs = require('fs');
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');

fs.mkdir(projectDistPath, { recursive: true }, (err) => {
  if (err) console.log(err);
});

// compile styles

let writeText = fs.createWriteStream(
  path.join(__dirname, '/project-dist', 'style.css'),
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

// copy assets

const sourceFolder = path.join(__dirname, 'assets');
const destinationFolder = path.join(projectDistPath, 'assets');

fs.mkdir(destinationFolder, { recursive: true }, (err) => {
  if (err) console.log(err);
});

const copyDir = (src, dest, callback) => {
  const copy = (copySrc, copyDest) => {
    fs.readdir(copySrc, (err, list) => {
      if (err) {
        callback(err);
        return;
      }
      list.forEach((item) => {
        const ss = path.resolve(copySrc, item);
        fs.stat(ss, (err, stat) => {
          if (err) {
            callback(err);
          } else {
            const curSrc = path.resolve(copySrc, item);
            const curDest = path.resolve(copyDest, item);
            if (stat.isFile()) {
              fs.createReadStream(curSrc).pipe(fs.createWriteStream(curDest));
            } else if (stat.isDirectory()) {
              fs.mkdir(curDest, { recursive: true }, (e) => {
                if (e) console.log(e);
              });
              copy(curSrc, curDest);
            }
          }
        });
      });
    });
  };

  fs.access(dest, (err) => {
    if (err) {
      fs.mkdir(dest, { recursive: true }, (e) => {
        if (e) console.log(e);
      });
    }
    copy(src, dest);
  });
};

copyDir(sourceFolder, destinationFolder);

// compile components

const components = [];

function parseComponents() {
  fs.readdir(
    path.join(__dirname, '/components'),
    { withFileTypes: true },
    (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        if (file.isFile() && file.name.endsWith('.html')) {
          components.push(file.name.split('.').slice(0, -1).join('.'));
        }
      });
    },
  );
}

parseComponents();

function compileHTML() {
  fs.readFile(path.join(__dirname, 'template.html'), 'utf8', (err, file) => {
    if (err) throw err;
    for (let i = components.length - 1; i >= 0; i--) {
      const component = components[i];
      fs.readFile(
        path.join(path.join(__dirname, '/components'), `${component}.html`),
        'utf8',
        (err, fileComp) => {
          if (err) throw err;
          let pattern = new RegExp(`{{${component}}}`, 'g');
          file = file.replace(pattern, fileComp);
          const index = components.findIndex((a) => a === component);
          components.splice(index, 1);
          if (components.length === 0) {
            fs.writeFile(
              path.join(projectDistPath, 'index.html'),
              file,
              (err) => {
                if (err) throw err;
              },
            );
          }
        },
      );
    }
  });
}

compileHTML();
