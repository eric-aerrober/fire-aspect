import { EventType } from "../../database/apis/events_table";
import { contextFromConversation } from "../executions/ExecutionBuilder";
import { AgentRunsExecutionNode } from "../executions/implementations/AgentRootNode";

export async function AgentRespondToUserWorkflow (conversationId: string) {
    const executionContext = await contextFromConversation({ conversationId, type: EventType.WORKFLOW_ROOT_EVENT })
    try {
        const waitForModelResponse = await executionContext.runNode(new AgentRunsExecutionNode())
        await executionContext.completeWithData(waitForModelResponse.state.chatResponse)
        return waitForModelResponse.state.chatResponse
    } catch (e) {
        if (e instanceof Error) {
            await executionContext.completeWithData("INTERNAL-ERROR: " + e.message)
            return e.message
        }
    }
}