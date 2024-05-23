import { EventType } from "../../database/apis/events_table";
import { DB } from "../../database/database";
import { Status } from "../../database/enums";
import { ExecutionContext } from "./ExecutionContext";

export class ExecutionNode <InputExecutionState, OutputExecutionState> {

    private type : EventType

    constructor (type: EventType) {
        this.type = type;
    }

    public async invoke (context: ExecutionContext<InputExecutionState>) : Promise<ExecutionContext<OutputExecutionState>> {
        const executionContext = await context.childContext(this.type);
        const invokedInternal = await this.invokeInternal(executionContext);
        await executionContext.completeContext();
        return invokedInternal;
    }

    protected async invokeInternal (context: ExecutionContext<InputExecutionState>) : Promise<ExecutionContext<OutputExecutionState>> {
        throw new Error('Not implemented');
    }

}