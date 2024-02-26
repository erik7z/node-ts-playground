const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const sqlScriptFilePath = path.join(__dirname, 'script.sql');

function deleteOldFile() {
    if (fs.existsSync(sqlScriptFilePath)) {
        fs.unlinkSync(sqlScriptFilePath);
    }
}

function startTransaction() {
    fs.writeFileSync(sqlScriptFilePath, 'START TRANSACTION;\n');
}

function addToScript(sqlQuery) {
    fs.appendFileSync(sqlScriptFilePath, `${sqlQuery}\n`);
}

function saveAndEndTransaction() {
    fs.appendFileSync(sqlScriptFilePath, 'COMMIT;\n');
}

deleteOldFile();
startTransaction();

const FILE_PATH = './old/RLS-16217/ro2_bns_202401030917.csv';
const MAX_LINES = 100000;

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
        else {
            notMatch++;
            // addToScript(`UPDATE bonus.bns SET output_bet_sum = CASE WHEN ${recordSum.toFixed(2)} - output_bet_sum > 0 THEN output_bet_sum + (${recordSum.toFixed(2)} - output_bet_sum) ELSE output_bet_sum - (${recordSum.toFixed(2)} - output_bet_sum) WHERE id=${row.id};`);
            // addToScript(`UPDATE bonus.bns SET output_bet_sum = CASE WHEN output_bet_sum + ${recordSum.toFixed(2) - row.output_bet_sum} > output_max_sum THEN output_max_sum ELSE output_bet_sum + ${recordSum.toFixed(2) - row.output_bet_sum} WHERE id=${row.id};`);
            addToScript(`UPDATE bonus.bns SET output_bet_sum = output_bet_sum + ${(recordSum - row.output_bet_sum).toFixed(2)} WHERE id=${row.id};`);
        }``

        console.log(`line# ${lineCount} :: id: ${row.id} :: addInfo -> ${recordSum.toFixed(2)} : ${row.output_bet_sum} <- output_bet_sum :: ${isMatched ? 'MATCH' : 'NOT_MATCH'} `);


        lineCount++;
        if (lineCount >= MAX_LINES) {
            console.log(`Match: ${match} | Not Match: ${notMatch}`);
            process.exit(0);
        }
    })
    .on('end', () => {
        saveAndEndTransaction();
        console.log(`Match: ${match} | Not Match: ${notMatch}`);

        console.log('CSV file successfully processed');
    });
