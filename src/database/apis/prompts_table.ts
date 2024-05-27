import { text, sqliteTable, real } from "drizzle-orm/sqlite-core";
import { DrizzleTableRecord, TableRecord } from "../table_types";

export const PromptsDefinedTable = sqliteTable('PromptsTable', DrizzleTableRecord({
    content: text('content').notNull(),
}));
  
export type PromptsDefinedTableElement =  TableRecord<{
    content: string;
}>