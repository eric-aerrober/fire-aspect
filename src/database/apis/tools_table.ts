import { text, sqliteTable, real } from "drizzle-orm/sqlite-core";
import { DrizzleTableRecord, TableRecord } from "../table_types";

export const ToolDefinedTable = sqliteTable('ToolDefinedTable', DrizzleTableRecord({
    name: text('toolName').notNull(),
    description: text('toolDescription').notNull(),
    owner: text('owner').notNull(),
    toolType: text('toolType').notNull(),
    toolConfig: text('toolConfig').notNull(),
    toolParams: text('toolParams').notNull(),
}));
  
export type ToolDefinedTableElement =  TableRecord<{
    name: string;
    description: string;
    owner: string;
    toolType: string;
    toolConfig: string;
    toolParams: string;
}>