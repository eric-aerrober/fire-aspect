import { EventType } from "../../../database/apis/events_table";
import { describeTools } from "../../tools/ToolIntegration";
import { extractObject } from "../../utils/strings";
import { ExecutionContext } from "../ExecutionContext";
import { ExecutionNode } from "../ExecutionNode";
import { ChatModelRespondExecutionNode } from "./ChatModelRespondNode";
import { ToolInvokeExecutionNode } from "./ToolInvokeNode";

export interface AgentRespondExecutionNodeInputState {}

export interface AgentRespondExecutionNodeResultState {
    chatResponse: string
}

export class AgentRunsExecutionNode extends ExecutionNode<AgentRespondExecutionNodeInputState, AgentRespondExecutionNodeResultState> {

    public constructor () {
        super(EventType.AGENT_WORKFLOW)
    }

    protected async invokeInternal (context: ExecutionContext<AgentRespondExecutionNodeInputState>) {
        
        const historyWithToolQuestion = context.addUserMessage(`

            We are going to use the above conversation history as a refence and now begin an automatic solving process.
            You are now chatting with a software system which has the ability to invoke tools, models, and other systems to help you.
            To begin, i will list out all the tools that you have access to. If you respond correctly, you may invoke these tools to help you solve this problem.

            Your Known Tools:

            ${describeTools(context.tools)}

        
            I am now asking that select a tool for us to use in order to solve this problem. Please respond with valid pretty json in the below format:

            {
                "problem": "you own description of the problem we are trying to solve",
                "plan": "the high level plan you have in mind to solve the problem",
                "tools": [
                    {
                        "toolId": "the id of the tool you want to use",
                        "toolUse": "what this tool will do for us in solving the problem",
                        "params": {
                            [paramName]: [paramValue]
                        }
                    }
                    . . . // possible many tools
                ]
            }

        `)

        const invokeNode = new ChatModelRespondExecutionNode()
        const invokeResult = await invokeNode.invoke(historyWithToolQuestion)
        const message = extractObject(invokeResult.state.chatResponse);
        
        // Then invoke each tool
        const allResults : any = {}

        for (const toolObj of message.tools) {
            const toolParams = toolObj.params
            const toolContext = context.mergeState({
                toolId: toolObj.toolId,
                toolParams
            })
            const toolNode = new ToolInvokeExecutionNode()
            const toolResult = await toolNode.invoke(toolContext)
            allResults[toolObj.toolId] = toolResult.state.toolResult
        }

        // Then ask the agent to respond to the user

        const agentResponse = historyWithToolQuestion.addUserMessage(`

            The tools have been invoked and the results are as follows:

            ${JSON.stringify(allResults, null, 2)}

            Please respond formated to the following json format:

            {
                "solved": "why or why not the problem was solved",
                "history": "natural language sumary of tools used and results",
                "response": "the final response to be sent to the user, or an explanation of why the problem was not solved"
            }

        `)

        const invokeSummaryNode = new ChatModelRespondExecutionNode()
        const invokeSummaryResult = await invokeSummaryNode.invoke(agentResponse)
        const finalMessage = extractObject(invokeSummaryResult.state.chatResponse);

        return context.mergeState({
            chatResponse: finalMessage.response 
        })

    }
}