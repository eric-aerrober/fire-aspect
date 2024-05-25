import fs from 'fs';

const workspace = process.argv[2];
const inputPath = `${workspace}/input.json`
const resultPath = `${workspace}/result.json`

const input = fs.readFileSync(inputPath, 'utf8');

console.log("input here")

const output = {
    result: {
        randomNumber: 12
    }
}

fs.writeFileSync(resultPath, JSON.stringify(output));

