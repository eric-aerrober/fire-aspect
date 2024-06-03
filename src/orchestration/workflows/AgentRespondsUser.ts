import { EventType } from "../../database/apis/events_table";
import { contextFromConversation } from "../executions/ExecutionBuilder";
import { AgentExecutionNode } from "../executions/implementations/agent/AgentNode";

export async function AgentRespondToUserWorkflow (conversationId: string) {
    const executionContext = await contextFromConversation({ conversationId, type: EventType.WORKFLOW_ROOT_EVENT })
    try {
        const context = executionContext.mergeState({
            direction: executionContext.getLastUserMessage()?.message || 'help the user'
        })
        const waitForModelResponse = await new AgentExecutionNode().invoke(context)
        await executionContext.completeWithData(waitForModelResponse.state.chatResponse)
        return waitForModelResponse.state.chatResponse
    } catch (e) {
        if (e instanceof Error) {
            await executionContext.completeWithData("INTERNAL-ERROR: " + e.message)
            return e.message
        }
    }
}