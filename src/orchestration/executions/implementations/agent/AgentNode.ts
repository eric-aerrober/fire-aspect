import { EventType } from "../../../../database/apis/events_table";
import { PromptStore } from "../../../prompts/PromptStore";
import { describeTools } from "../../../tools/ToolIntegration";
import { extractObject } from "../../../utils/strings";
import { ExecutionContext } from "../../ExecutionContext";
import { ExecutionNode } from "../../ExecutionNode";
import { AgentTakeActionNode } from "./AgentTakeActionNode";
import { ChatModelRespondExecutionNode } from "../ChatModelRespondNode";
import { ChatModelObjectResponseNode } from "../ChatModelObjectNode";

export interface AgentExecutionNodeInputState {
    direction: string
}

export interface AgentExecutionNodeResultState {
    actions: {
        action: string,
        details: string
        variables: {
            id: string
            description: string
        }[]
    }[],
    summary: string
    status: 'success' | 'failure'
}

interface AssessResultsObject {
    goal: string
    recent: string
    results: string
    determiner: string
    summary: string
    status: string
    response: string
}


export class AgentExecutionNode extends ExecutionNode<AgentExecutionNodeInputState, AgentExecutionNodeResultState> {

    private static PROMPT = new PromptStore('base-agent')

    public constructor () {
        super(EventType.AGENT_WORKFLOW)
    }

    // When this agent node is invoked, we take in a context containing the agent input state
    protected async invokeInternal (context: ExecutionContext<AgentExecutionNodeInputState>) {
        
        // Build a new conversation context for this agent
        const systemPrompt = await AgentExecutionNode.PROMPT.loadPrompt('system', {
            context: JSON.stringify(context.getConversationHistory(), null, 2),
            directions: context.state.direction
        })

        const agentContext = context
            .clearMessages()
            .addUserMessage(systemPrompt)

        // Now we start to solve the problem step by step, up to N steps
        let loopContext : ExecutionContext<{}> = agentContext;

        for (let i = 0; i < 5; i++) {

            // Allow the agent to choose and invoke any tools it wants to run
            const invokeNode = new AgentTakeActionNode()
            const invokeResult = await invokeNode.invoke(loopContext)
        
            // Then ask the agent to assess the situation
            const assessment = await AgentExecutionNode.PROMPT.loadPrompt('assess-results')
            const assessmentNode = new ChatModelRespondExecutionNode()
            const assessmentResult = await assessmentNode.invoke(invokeResult.addUserMessage(assessment))
            const message = extractObject<AssessResultsObject>(assessmentResult.state.chatResponse);

            if (!message) {
                throw new Error('Failed to extract message from agent response')
            }

            // Are we still ongoing?
            if (message.status === 'inprogress') {
                const afterAssessment = await AgentExecutionNode.PROMPT.loadPrompt('after-assessment', {
                    response: message.response,
                    status: message.status
                })
                loopContext = invokeResult
                    .addUserMessage(afterAssessment)
                    .makeChildOf(context)
                continue
            }

            // If we are complete, break
            loopContext = invokeResult
            break;
            
        }

        // Then build the summary response
        const afterAssessment = await AgentExecutionNode.PROMPT.loadPrompt('build-response')
        const responseObject = await new ChatModelObjectResponseNode<AgentExecutionNodeResultState>()
            .invoke(loopContext.addUserMessage(afterAssessment))

        if (!responseObject) {
            throw new Error('Failed to extract response object')
        }

        // Provide finalr response
        const afterResponse = await AgentExecutionNode.PROMPT.loadPrompt('after-complete', {
            goal: context.state.direction,
            actions: JSON.stringify(responseObject.state.actions, null, 2),
            status: responseObject.state.status,
            response: responseObject.state.summary
        })

        return loopContext
            .addUserMessage(afterResponse)
            .mergeState(responseObject.state)

    }
}