import { EventType } from "../../database/apis/events_table";
import { DB } from "../../database/database";
import { contextFromConversation } from "../executions/ExecutionBuilder";
import { AgentExecutionNode } from "../executions/implementations/agent/AgentNode";

export async function AgentRespondToUserWorkflow (conversationId: string) {
    const executionContext = await contextFromConversation({ conversationId, type: EventType.WORKFLOW_ROOT_EVENT })
    try {
        // Run the agent
        const context = executionContext.mergeState({
            direction: executionContext.getLastUserMessage()?.message || 'help the user'
        })
        const agentResponse = await new AgentExecutionNode().invoke(context)

        // Add in the variables to the DB
        for (const action of agentResponse.state.actions) {
            for (const variable of action.variables) {
                await DB.variables.create({
                    id: variable.id,
                    description: variable.description,
                    kind: agentResponse.getVariable(variable.id).type,
                    content: agentResponse.getVariable(variable.id).value,
                    owningEvent: executionContext.rootEvent.id
                })
            }
        }

        // Complete the event with the agent response
        await executionContext.completeWithData(agentResponse.state.summary)
    } catch (e) {
        if (e instanceof Error) {
            console.error(e)
            await executionContext.completeWithData("INTERNAL-ERROR: " + e.message)
            return e.message
        }
    }
}