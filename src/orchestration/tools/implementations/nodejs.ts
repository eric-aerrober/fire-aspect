import { exec } from "child_process";
import { DB } from "../../../database/database";

export async function InvokeNodeJSTool (id: string, workspacePath: string) {

    const toolObj = await DB.tools.get(id)
    const config = JSON.parse(toolObj.toolConfig)
    const scriptPath = config.script

    const command = `node ${scriptPath} ${workspacePath}`

    await new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err)
            } else {
                resolve(stdout)
            }
        })
    })

}