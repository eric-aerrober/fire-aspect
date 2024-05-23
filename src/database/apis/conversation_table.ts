import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { DrizzleTableRecord, TableRecord } from "../table_types";

export enum ConversationType {
    CHAT_MODEL = 'chat-model',
    CHAT_AGENT = 'chat-agent',
}

export const ConversationTable = sqliteTable('ConversationTable', DrizzleTableRecord({
    name: text('conversationName'),
    conversationType: text('conversationType').notNull(),
    sourceId: text('sourceId').notNull(),
    blockingEventId: text('blockingEventId'),
}));
  
export type ConversationTableElement =  TableRecord<{
    name: string;
    conversationType: ConversationType;
    sourceId: string;
    blockingEventId: string;
}>