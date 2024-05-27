import { PromptStore } from "../../../prompts/PromptStore";
import { describeTools } from "../../../tools/ToolIntegration";
import { extractObject } from "../../../utils/strings";
import { ExecutionContext } from "../../ExecutionContext";
import { ChatModelRespondExecutionNode } from "../ChatModelRespondNode";
import { ToolInvokeExecutionNode } from "../tools/ToolInvokeNode";
import { AbstractAgentExecutionNode, AbstractAgentExecutionNodeInputState } from "./_abstractAgentNode";

/*
    Very simple flow:

    1. User gives a direction
    2. We choose a single tool to solve the problem
    3. We invoke the tool
    4. We return the result to the user    
*/

export class DirectToolUseAgent extends AbstractAgentExecutionNode {

    private static PROMPT = new PromptStore('base-agent-directtool')

    // When this agent node is invoked, we take in a context containing the agent input state
    protected async invokeInternal (context: ExecutionContext<AbstractAgentExecutionNodeInputState>) {
        
        // Direction is the natural language input for this agent to act on 
        const { direction } = context.state

        // We build prompts
        const prompt_knownTools = describeTools(context.tools)
        const prompt_AgentSystemPrompt = await DirectToolUseAgent.PROMPT.loadPrompt('system', {tools: prompt_knownTools})
        const historyWithToolQuestion = context.addUserMessage(prompt_AgentSystemPrompt)

        // Then we ask it for a response
        const invokeNode = new ChatModelRespondExecutionNode()
        const invokeResult = await invokeNode.invoke(historyWithToolQuestion)
        const message = extractObject(invokeResult.state.chatResponse);
        
        // Then invoke each tool
        const allResults : any[] = []

        for (const toolObj of message.tools) {
            const toolParams = toolObj.params
            const toolContext = context.mergeState({
                toolId: toolObj.toolId,
                toolParams
            })
            const toolNode = new ToolInvokeExecutionNode()
            const toolResult = await toolNode.invoke(toolContext)
            allResults.push({
                toolId: toolObj.toolId,
                toolResult: toolResult.state.toolResult
            })
        }

        // Then ask the agent to respond to the user
        const prompt_PostInvokeSummary = await DirectToolUseAgent.PROMPT.loadPrompt('post-invoke-summary', {results: JSON.stringify(allResults, null, 2)})
        const agentResponse = historyWithToolQuestion
            .addAgentMessage(invokeResult.state.chatResponse)    
            .addUserMessage(prompt_PostInvokeSummary)

        const invokeSummaryNode = new ChatModelRespondExecutionNode()
        const invokeSummaryResult = await invokeSummaryNode.invoke(agentResponse)
        const finalMessage = extractObject(invokeSummaryResult.state.chatResponse);

        return context.mergeState({
            chatResponse: finalMessage.response 
        })

    }
}