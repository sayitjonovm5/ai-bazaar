const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const csvPath = path.join(__dirname, "..", "data", "cleaned_data_uz.csv");
const fileContent = fs.readFileSync(csvPath, "utf8");

const { data } = Papa.parse(fileContent, {
  header: true,
  skipEmptyLines: true,
});

const firstWords = {};

data.forEach((row) => {
  if (row.Product_Name) {
    const firstWordMatch = row.Product_Name.match(/^([A-Za-z'ʻ]+)/);
    if (firstWordMatch) {
      let word = firstWordMatch[1].toLowerCase();
      if (word.length > 2) {
        firstWords[word] = (firstWords[word] || 0) + 1;
      }
    }
  }
});

const sorted = Object.entries(firstWords).sort((a,b) => b[1] - a[1]).slice(0, 50);
console.log("Top 50 first words:");
console.log(sorted);
