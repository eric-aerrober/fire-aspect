import { DB } from "../../../../database/database";
import { randomId } from "../../../../database/utils";
import fs from 'fs'

export async function CreateEnvironmentTool (wsString: string) {

    const systemSettings = await DB.settings.getSettings()
    const workspace = systemSettings.executionWorkspace

    // Create the workspace

    const newId = randomId()
    const path = `${workspace}/environments/env-${newId}`
    await fs.promises.mkdir(path, { recursive: true })

    // Write the results
    await fs.promises.writeFile(`${wsString}/result.json`, JSON.stringify({
        response: 'New Environment created',
        data: {},
        variables: [
            {
                name: 'basic-system-env',
                type: 'system-env',
                description: 'The environment id for the environment which was created',
                value: path
            }
        ]
    }, null, 2))


}