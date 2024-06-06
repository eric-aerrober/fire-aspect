import { DB } from "../../../../database/database";
import { randomId } from "../../../../database/utils";
import fs from 'fs'

export interface WriteFileToEnvToolParams {
    targetEnv: string,
    filePath: string,
    fileData: string,
}

export async function WriteFileToEnvTool (wsString: string) {

    // Read params
    const inputBuffer = await fs.promises.readFile(`${wsString}/input.json`);
    const params: WriteFileToEnvToolParams = JSON.parse(inputBuffer.toString('utf-8')).params

    // Write the file
    if (params.fileData && params.fileData.length > 0) {
        const directoryPath = `${params.targetEnv}${params.filePath.substring(0, params.filePath.lastIndexOf('/'))}`
        await fs.promises.mkdir(directoryPath, { recursive: true })
        await fs.promises.writeFile(`${params.targetEnv}${params.filePath}`, params.fileData)
    }

    // Write the results
    await fs.promises.writeFile(`${wsString}/result.json`, JSON.stringify({
        response: 'File written',
        data: {},
        variables: [
            {
                name: 'file-content',
                type: 'string',
                description: 'The new file content after writing',
                value: params.fileData
            }
        ]
    }, null, 2))


}