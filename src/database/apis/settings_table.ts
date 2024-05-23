import { text, sqliteTable, real } from "drizzle-orm/sqlite-core";
import { DrizzleTableRecord, TableRecord } from "../table_types";

export const SettingsTable = sqliteTable('SettingsTable', DrizzleTableRecord({
    executionWorkspace: text('toolWorkspacePath'),
}));
  
export type SettingsTableElement =  TableRecord<{
    executionWorkspace: string | null;
}>