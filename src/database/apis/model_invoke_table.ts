import { text, sqliteTable, real } from "drizzle-orm/sqlite-core";
import { DrizzleTableRecord, TableRecord } from "../table_types";
import { Status } from "../enums";
import { IntegratedModel, ModelIntegrationType } from "../../orchestration/models/ModelIntegrationOptions";

export const ModelInvokeTable = sqliteTable('ModelInvokeTable', DrizzleTableRecord({
    modelId: text('modelId').notNull(),
    modelType: text('modelType').notNull(),
    inputRaw: text('inputRaw').notNull(),
    resultRaw: text('resultRaw').notNull(),
    status: text('status').notNull().default(Status.INPROGRESS),
    invokeTime: real('invokeTime')
}));
  
export type ModelInvokeTableElement =  TableRecord<{
    modelId: IntegratedModel;
    modelType: ModelIntegrationType;
    inputRaw: string;
    resultRaw: string;
    status: Status;
    invokeTime: number;
}>