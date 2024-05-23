import { EventType } from "../../database/apis/events_table";
import { contextFromConversation } from "../executions/ExecutionBuilder";
import { ChatModelRespondExecutionNode } from "../executions/implementations/ChatModelRespondNode";
import { ModelTitlesConversationExecutionNode } from "../executions/implementations/ConversationTitleNode";

export async function ChatModelRespondToConversationWorkflow (conversationId: string) {
    const executionContext = await contextFromConversation({ conversationId, type: EventType.CHAT_MODEL_RESPOND_MESSAGE })
    const waitForModelResponse = await executionContext.runNode(new ChatModelRespondExecutionNode())
    await executionContext.completeWithData(waitForModelResponse.state.chatResponse)
    return waitForModelResponse.state.chatResponse
}

export async function ChatGetsTitledWorkflow (conversationId: string) {
    const executionContext = await contextFromConversation({ conversationId, type: EventType.GENERATE_CONVERSATION_TITLE })
    const waitForModelResponse = await executionContext.runNode(new ModelTitlesConversationExecutionNode())
    await executionContext.completeWithData(waitForModelResponse.state.conversationTitle)
    return waitForModelResponse.state.conversationTitle
}