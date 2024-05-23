import { text, sqliteTable, real } from "drizzle-orm/sqlite-core";
import { DrizzleTableRecord, TableRecord } from "../table_types";

export const AgentsTable = sqliteTable('AgentsTable', DrizzleTableRecord({
    name: text('name'),
    systemPrompt: text('systemPrompt'),
    modelId: text('model'),
    tools: text('tools'),
    subAgents: text('subAgents'),
}));
  
export type AgentsTableElement =  TableRecord<{
    name: string | null;
    systemPrompt: string | null;
    modelId: string | null;
    tools: string | null;
    subAgents: string | null;
}>