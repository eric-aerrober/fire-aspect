// run on watch of ./prompts/**/*

import Database from 'better-sqlite3';
import fs from 'fs';

const sqlite = new Database('./data/database.db');
console.log('Connected to database.');

function getAllPromptFiles(path) {
    const results = [];
    const files = fs.readdirSync(path);

    for (const file of files) {
        if (fs.lstatSync(`${path}/${file}`).isDirectory()) {
            results.push(...getAllPromptFiles(`${path}/${file}`));
        }
        else {
            results.push(`${path}/${file}`);
        }
    }

    return results;

}

fs.watch('./prompts', {recursive: true}, (eventType, filename) => {

    console.log(`Detected change in prompts. Updating database...`);

    const files = getAllPromptFiles('./prompts');

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const name = file
            .replace('./prompts/', '')
            .split('.')[0]
            .replaceAll('/', '-')
            .toLowerCase();
        const insert = sqlite.prepare(`INSERT INTO PromptsTable (id, content, modifiedDate, creationDate, version) VALUES (?, ?, ?, ?, 0)`);
        const update = sqlite.prepare(`UPDATE PromptsTable SET content = ?, modifiedDate = ? WHERE id = ?`);
        const exists = sqlite.prepare(`SELECT * FROM PromptsTable WHERE id = ?`);

        const prompt = exists.get(name);

        if (prompt) {
            update.run(content, new Date().toISOString(), name);
        }
        else {
            insert.run(name, content, new Date().toISOString(), new Date().toISOString());
        }
    }

    console.log(`Updated prompts in database. ${files.length} files updated.`);

})