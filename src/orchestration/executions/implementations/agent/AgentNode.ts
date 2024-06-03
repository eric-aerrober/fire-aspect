import { EventType } from "../../../../database/apis/events_table";
import { PromptStore } from "../../../prompts/PromptStore";
import { describeTools } from "../../../tools/ToolIntegration";
import { extractObject } from "../../../utils/strings";
import { ExecutionContext } from "../../ExecutionContext";
import { ExecutionNode } from "../../ExecutionNode";
import { AgentTakeActionNode } from "./AgentTakeActionNode";
import { ChatModelRespondExecutionNode } from "../ChatModelRespondNode";

export interface AgentExecutionNodeInputState {
    direction: string
}

export interface AgentExecutionNodeResultState {
    chatResponse: string
}

interface AssessResultsObject {
    goal: string
    recent: string
    results: string
    determiner: string
    summary: string
    achieved: string
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
            direction: context.state.direction
        })

        const agentContext = context
            .clearMessages()
            .addUserMessage(systemPrompt)

        // Now we start to solve the problem step by step, up to N steps
        let loopContext : ExecutionContext<{}> = agentContext;
        let resultMessage: AssessResultsObject | undefined = undefined;

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

            // Are we done?
            if (message?.achieved === 'yes') {
                resultMessage = message
                break
            }

            // Else itterate with a summary of why we failed assessment
            const afterAssessment = await AgentExecutionNode.PROMPT.loadPrompt('after-assessment', {
                response: message.response
            })
            loopContext = invokeResult
                .addUserMessage(afterAssessment)
        }

        if (!resultMessage) {
            throw new Error('Failed to achieve goal')
        }

        // Then return results as a summary
        const afterAssessment = await AgentExecutionNode.PROMPT.loadPrompt('after-complete', {
            response: resultMessage.response,
            actions: resultMessage.results
        })

        return context
            .addUserMessage(afterAssessment)
            .mergeState({
                chatResponse: resultMessage.response
            })

    }
}