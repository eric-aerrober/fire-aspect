import { text, sqliteTable, real } from "drizzle-orm/sqlite-core";
import { DrizzleTableRecord, TableRecord } from "../table_types";

export const VariableTable = sqliteTable('VariableTable', DrizzleTableRecord({
    description: text('toolDescription').notNull(),
    kind: text('kind').notNull(),
    owningEvent: text('owningEvent').notNull(),
    content: text('content').notNull(),
}));
  
export type VariableTableElement =  TableRecord<{
    description: string;
    kind: string;
    owningEvent: string;
    content: string;
}>