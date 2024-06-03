import { DB } from "../../../../database/database";
import { InvokeToolAsBashScript } from "../../RunTool";

export async function InvokeNodeJSTool (id: string, workspacePath: string) {

    const toolObj = await DB.tools.get(id)
    const config = JSON.parse(toolObj.toolConfig)
    const scriptPath = config.script

    const command = `node ${scriptPath} ${workspacePath}`
    await InvokeToolAsBashScript(workspacePath, command)

}