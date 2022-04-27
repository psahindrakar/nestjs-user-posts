const fs = require('fs');

console.log(JSON.parse(fs.readFileSync('./db.json', 'utf-8')));