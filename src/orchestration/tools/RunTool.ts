import { exec } from "child_process";
import fs from 'fs';

export async function InvokeToolAsBashScript (workspacePath: string, bash: string) {

    const result = await new Promise<string>((resolve, reject) => {
        exec(bash, (err, stdout, stderr) => {
            if (err) {
                reject(err)
            } else {
                resolve(stdout)
            }
        })
    })

    fs.writeFileSync(`${workspacePath}/output.txt`, result)
}