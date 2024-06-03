/* Called to populate the data base with all the default values needed for execution */

import { ToolIntegrationType } from "../orchestration/tools/ToolIntegrationOptions";
import { DB } from "./database";
import fs from 'fs'

export async function PopulateDatabase () {

    DB.tools.createNewSystemTool({
        name: 'create-env',
        description: 'A tool that runs and creates an ENVIRONMENT and adds a reference to it into the VARIABLES defined for the execution',
        toolType: ToolIntegrationType.SYSTEM,
        toolConfig: {},
        toolParams: {}
    })

    DB.tools.createNewSystemTool({
        name: 'write-file',
        description: 'A tool that writes a file a given environment',
        toolType: ToolIntegrationType.SYSTEM,
        toolConfig: {},
        toolParams: [
            {
                name: 'targetEnv',
                description: 'The environment to write the file to. Should be a "system-env" type variable',
            },
            {
                name: 'filePath',
                description: 'The path to the file to write relative to the environment, e.g. /file.txt. Must start with a /',
            },
            {
                name: 'fileData',
                description: 'The data to write to the file in plain text. Use \n for new lines and escape characters as needed',
            }
        ]
    })

    await loadAllPrompt()

}


function getAllPromptFiles(path: string): string[] {
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

async function loadAllPrompt() {

    const files = getAllPromptFiles('./prompts');
    console.log("loading prompts", files)

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const name = file
            .replace('./prompts/', '')
            .split('.')[0]
            .replaceAll('/', '-')
            .toLowerCase();

        const exists = await DB.prompts.exists(name)

        if (exists) {
            await DB.prompts.delete(name)
        }

        await DB.prompts.create({
            id: name, 
            content: content
        })
    }


}