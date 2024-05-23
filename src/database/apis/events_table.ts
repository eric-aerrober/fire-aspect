import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { DrizzleTableRecord, TableRecord } from "../table_types";
import { Status } from "../enums";

export enum EventType {
    CONVERSATION_REFERENCE = 'conversation-reference',
    USER_CHAT_MESSAGE = 'user-chat-message',
    CHAT_MODEL_RESPOND_MESSAGE = 'chat-model-respond-message',
    GENERATE_CONVERSATION_TITLE = 'generate-conversation-title',
    WORKFLOW_ROOT_EVENT = 'workflow-root-event',
    AGENT_WORKFLOW = 'workflow-agent-event',
    TOOL_INVOKE = 'tool-invoke',
}

export const EventsTable = sqliteTable('EventsTable', DrizzleTableRecord({
    parentId: text('parentId'),
    type: text('type').notNull(),
    relatedRecords: text('relatedRecords'),
    content: text('content'),
    status: text('status').notNull().default(Status.INPROGRESS),
}));
  
export type EventTableElement =  TableRecord<{
    parentId: string;
    type: EventType;
    relatedRecords: string;
    content: string;
    status: Status;
}>