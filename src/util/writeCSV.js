const fs = require('fs');
const path = require('path');
const { stringify } = require('csv-stringify');
const { cwd } = require('process');

function writeCSV(list, name) {
  // Convert the data to a CSV string
  stringify(list, (err, output) => {
    if (err) {
      console.error(err);
      return;
    }

    fs.writeFile(path.join(cwd(), `assets/${name}.csv`), output, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(`file ${name}.csv saved successfully!`);
    });
  });
}

module.exports = writeCSV
