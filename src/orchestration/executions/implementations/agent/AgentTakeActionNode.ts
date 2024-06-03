import { EventType } from "../../../../database/apis/events_table";
import { ExecutionContext } from "../../ExecutionContext";
import { ExecutionNode } from "../../ExecutionNode";
import { PromptStore } from "../../../prompts/PromptStore";
import { describeTools } from "../../../tools/ToolIntegration";
import { ChatModelRespondExecutionNode } from "../ChatModelRespondNode";
import { extractObject } from "../../../utils/strings";
import { ToolInvokeExecutionNode } from "../ToolInvokeNode";
import { ExecutionVariable } from "../../ExecutionVariable";

export interface AgentActionNodeInputState {}

export interface AgentActionNodeResultState {}

interface ModelResponseObject {
    prompt: string
    plan: string
    tools: {
        toolId: string
        toolUse: string
        params: any
    }[]
}

export class AgentTakeActionNode extends ExecutionNode<AgentActionNodeInputState, AgentActionNodeResultState> {
    
    private static PROMPT = new PromptStore('base-agent')

    public constructor () {
        super(EventType.TOOL_INVOKE)
    }

    protected async invokeInternal (context: ExecutionContext<AgentActionNodeInputState>) {
        
        // Ask the agent which tools it wishes to run
        const chooseToolPrompt = await AgentTakeActionNode.PROMPT.loadPrompt('choose-tool', {
            tools: describeTools(context.tools)
        })

        const askForToolContext = context
            .addUserMessage(chooseToolPrompt)

        // Then allow the agent to choose and invoke any tools it wants to run
        const invokeNode = new ChatModelRespondExecutionNode()
        const invokeResult = await invokeNode.invoke(askForToolContext)
        const message = extractObject<ModelResponseObject>(invokeResult.state.chatResponse);

        if (!message) {
            throw new Error('Invalid response from model, was not json')
        }

        // Invoke the tools themselves
        const toolResults: any[] = []
        const variables: ExecutionVariable[] = []

        for (const tool of message.tools) {
            const toolNode = new ToolInvokeExecutionNode()
            const result = await toolNode.invoke(context
                .mergeState({
                    toolId: tool.toolId,
                    toolParams: tool.params
                })
            )
            const definedVariables = result.state.tool.variables

            for (const variable of definedVariables) {
                variables.push(result.getVariable(variable.variable))
            }

            toolResults.push({
                toolId: tool.toolId,
                input: {
                    toolUse: tool.toolUse,
                    params: tool.params,
                },
                output: {
                    invokeResponse: result.state.tool.response,
                    invokeData: result.state.tool.data,
                    variables: definedVariables
                }
            })
        }

        // Format model response
        const resultPrompt = await AgentTakeActionNode.PROMPT.loadPrompt('after-tools', {
            results: JSON.stringify(toolResults, null, 2)
        })

        return context
            .withVariables(variables)
            .addUserMessage(resultPrompt)

    }

}