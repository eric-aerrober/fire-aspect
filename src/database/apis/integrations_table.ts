import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { DrizzleTableRecord, TableRecord } from "../table_types";
import { IntegratedModel, ModelIntegrationType } from "../../orchestration/models/ModelIntegrationOptions";

export const IntegrationsTable = sqliteTable('integrationsTable', DrizzleTableRecord({
    name: text('name').notNull(),
    integrationType: text('integrationType').notNull(),
    modelId: text('modelId').notNull(),
    integrationParams: text('integrationParams'),
}));
  
export type IntegrationTableElement =  TableRecord<{
    name: string;
    integrationType: ModelIntegrationType;
    modelId: IntegratedModel;
    integrationParams: string | null;
}>


