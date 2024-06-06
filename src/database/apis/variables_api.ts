import { desc, eq } from "drizzle-orm";
import { APIWrapper } from "../api_wrapper";
import { ToolDefinedTable, ToolDefinedTableElement } from "./tools_table";
import { timestamp } from "../utils";
import { VariableTable, VariableTableElement } from "./variables_table";

export class VariablesAPI extends APIWrapper<VariableTableElement, typeof VariableTable> {

    public async getVariablesForEvent (eventId: string) {
        return this.db.select()
            .from(this.table)
            .where(eq(this.table.owningEvent, eventId))
            .orderBy(desc(this.table.creationDate))
    }

}
