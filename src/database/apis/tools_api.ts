import { desc, eq } from "drizzle-orm";
import { APIWrapper } from "../api_wrapper";
import { ToolDefinedTable, ToolDefinedTableElement } from "./tools_table";
import { timestamp } from "../utils";

export class ToolApi extends APIWrapper<ToolDefinedTableElement, typeof ToolDefinedTable> {

    public async userCreated() {
        return this.db.select()
            .from(this.table)
            .where(eq(this.table.owner, 'USER'))
            .orderBy(desc(this.table.creationDate))
    }

    public async systemCreated() {
        return this.db.select()
            .from(this.table)
            .where(eq(this.table.owner, 'SYSTEM'))
            .orderBy(desc(this.table.creationDate))
    }

    public async createNewSystemTool ({name, description, toolType, toolConfig, toolParams} : {name: string, description: string, toolType: string, toolConfig: any, toolParams: any}) {

        const id = `${this.table_name}::sys-${name}`

        if (await this.exists(id)) {
            return
        }

        return this.create({
            id: id,
            creationDate: timestamp(),
            modifiedDate: timestamp(),
            version: 0,
            name, 
            description,
            owner: 'SYSTEM', 
            toolType: toolType, 
            toolConfig: JSON.stringify(toolConfig),
            toolParams: JSON.stringify(toolParams)
        })
    }

}
