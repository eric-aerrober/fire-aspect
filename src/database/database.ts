import { EventsTable } from "./apis/events_table"
import { EventsAPI } from "./apis/events_api"
import { IntegrationsAPI } from "./apis/integrations_api"
import { IntegrationsTable } from "./apis/integrations_table"
import { ModelInvokeAPI } from "./apis/model_invoke_api"
import { ModelInvokeTable } from "./apis/model_invoke_table"
import { ConversationAPI } from "./apis/conversation_api"
import { ConversationTable } from "./apis/conversation_table"
import { ToolApi } from "./apis/tools_api"
import { ToolDefinedTable } from "./apis/tools_table"
import { SettingsApi } from "./apis/settings_api"
import { SettingsTable } from "./apis/settings_table"
import { AgentsApi } from "./apis/agents_api"
import { AgentsTable } from "./apis/agents_table"

//@ts-ignore
const DRIZZLE : any = window._db as any

export const DB = {
    integrations: new IntegrationsAPI(DRIZZLE, IntegrationsTable, 'integrations'),
    events: new EventsAPI(DRIZZLE, EventsTable, 'events'),
    modelInvokes: new ModelInvokeAPI(DRIZZLE, ModelInvokeTable, 'modelInvokes'),
    conversations: new ConversationAPI(DRIZZLE, ConversationTable, 'conversations'),
    tools: new ToolApi(DRIZZLE, ToolDefinedTable, 'tools'),
    settings: new SettingsApi(DRIZZLE, SettingsTable, 'settings'),
    agents: new AgentsApi(DRIZZLE, AgentsTable, 'agents')
}