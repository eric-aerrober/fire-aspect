import { EventType } from "../../../../database/apis/events_table";
import { describeTools } from "../../../tools/ToolIntegration";
import { extractObject } from "../../../utils/strings";
import { ExecutionContext } from "../../ExecutionContext";
import { ExecutionNode } from "../../ExecutionNode";
import { ChatModelRespondExecutionNode } from "../ChatModelRespondNode";
import { ToolInvokeExecutionNode } from "../tools/ToolInvokeNode";

/*
    At a high level, an agent takes in a request / direction and solves it using the tools it has access to
    This can involve invoking multiple tools in a sequence to solve the problem, planning ahead, or other strategies.    
*/

export interface AbstractAgentExecutionNodeInputState {
    direction: string
}

export interface AbstractAgentExecutionNodeResultState {
    chatResponse: string
}

export class AbstractAgentExecutionNode extends ExecutionNode<AbstractAgentExecutionNodeInputState, AbstractAgentExecutionNodeResultState> {

    public constructor () {
        super(EventType.AGENT_WORKFLOW)
    }

    protected async invokeInternal (context: ExecutionContext<AbstractAgentExecutionNodeInputState>) {
        throw new Error('Not implemented');
        return undefined as any;
    }
}