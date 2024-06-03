import { ConversationTableElement } from "../../database/apis/conversation_table"
import { EventTableElement, EventType } from "../../database/apis/events_table"
import { ToolDefinedTableElement } from "../../database/apis/tools_table"
import { DB } from "../../database/database"
import { Status } from "../../database/enums"
import { BuildIntegrations } from "../models/IntegrationBuilder"
import { ToolIntegrations } from "../tools/ToolIntegration"
import { ConversationHistoryMessage, ExecutionContext } from "./ExecutionContext"

export interface ExecutionContextofRespondConversation {
    conversationId: string,
    type?: EventType
}

function buildConversationHistoryFromEvents (events: EventTableElement[]) {

    const conversationHistory : ConversationHistoryMessage[] = []

    for (const event of events) {
        if (event.type === EventType.USER_CHAT_MESSAGE) {
            conversationHistory.push({
                sender: 'user',
                message: event.content
            })
        } else if (event.type === EventType.CHAT_MODEL_RESPOND_MESSAGE) {
            conversationHistory.push({
                sender: 'agent',
                message: event.content
            })
        } else if (event.type === EventType.WORKFLOW_ROOT_EVENT) {
            conversationHistory.push({
                sender: 'agent',
                message: event.content
            })
        }
    }

    return conversationHistory
}

async function getIntegrationsFromConversation (conversation: ConversationTableElement) {
    const targetChatIntegration = await DB.integrations.get(conversation.sourceId)
    if (targetChatIntegration) 
        return targetChatIntegration
    const targetAgentIntegration = await DB.agents.get(conversation.sourceId)
    if (targetAgentIntegration) {
        const targetAgentChatIntegration = await DB.integrations.get(targetAgentIntegration.modelId!)
        if (targetAgentChatIntegration) 
                return targetAgentChatIntegration
    }
    throw new Error('Integration not found')
}

async function getToolsForConversation (conversation: ConversationTableElement) {
    const targetAgentIntegration = await DB.agents.get(conversation.sourceId)
    if (targetAgentIntegration && targetAgentIntegration.tools) {
        const toolIds = JSON.parse(targetAgentIntegration.tools)
        const tools = await Promise.all(toolIds.map((id: string) => DB.tools.get(id))) as ToolDefinedTableElement[]
        const toolIntegrations = {} as ToolIntegrations
        for (const tool of tools) {
            toolIntegrations[tool.id] = {
                name: tool.name,
                description: tool.description,
                toolType: tool.toolType,
                config: JSON.parse(tool.toolConfig || '{}'),
                params: JSON.parse(tool.toolParams || '{}')
            }
        }
        return toolIntegrations
    }
    return {}
}

export async function contextFromConversation (conversationData: ExecutionContextofRespondConversation) {

    // Load in current state of world
    const conversationObj = await DB.conversations.get(conversationData.conversationId)
    const targetIntegration = await getIntegrationsFromConversation(conversationObj)
    const events = await DB.events.allFromConversation(conversationData.conversationId)
    const tools = await getToolsForConversation(conversationObj)

    // Add in the root event reference
    const rootEvent = await DB.events.create({
        parentId: conversationData.conversationId,
        type: conversationData.type || EventType.WORKFLOW_ROOT_EVENT,
        status: Status.INPROGRESS
    })
    await DB.conversations.blockOnEvent(rootEvent)
    
    // Return the execution context
    return new ExecutionContext({
        integrations: BuildIntegrations([targetIntegration]),
        rootEvent,
        conversationHistory: buildConversationHistoryFromEvents(events),
        storedState: {},
        tools: tools,
        contextVariables: {}
    })

}

