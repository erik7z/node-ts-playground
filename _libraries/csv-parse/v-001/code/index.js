const fs = require('fs');
const csv = require('csv-parser');

const FILE_PATH = './bns_de2.csv';
const MAX_LINES = 10000;

let lineCount = 0;

let match = 0;
let notMatch = 0;
fs.createReadStream(FILE_PATH)
    .pipe(csv({separator: ';'}))
    .on('data', (row) => {
        const addInfo = row['add_info'];
        const lines = addInfo.split('\n');

        let recordSum = 0.0;
        lines.forEach(line => {
            const match = /was increased by (\d+(\.\d+)?)/.exec(line);
            if (match) {
                const increaseAmount = parseFloat(match[1]);
                recordSum += increaseAmount;
            }
        });

        const isMatched = Math.abs(recordSum - parseFloat(row.output_bet_sum)) < 0.01;
        if (isMatched) match++;
        else notMatch++;

        console.log(`line# ${lineCount} :: id: ${row.id} :: addInfo -> ${recordSum.toFixed(2)} : ${row.output_bet_sum} <- output_bet_sum :: ${isMatched ? 'MATCH' : 'NOT_MATCH'} `);


        lineCount++;
        if (lineCount >= MAX_LINES) {
            console.log(`Match: ${match} | Not Match: ${notMatch}`);
            process.exit(0);
        }
    })
    .on('end', () => {
        console.log(`Match: ${match} | Not Match: ${notMatch}`);

        console.log('CSV file successfully processed');
    });
