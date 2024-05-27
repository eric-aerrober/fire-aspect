import { EventType } from "../../../../database/apis/events_table";
import { DB } from "../../../../database/database";
import { ToolIntegrationType } from "../../../tools/ToolIntegrationOptions";
import { InvokeNodeJSTool } from "../../../tools/implementations/nodejs";
import { ExecutionContext } from "../../ExecutionContext";
import { ExecutionNode } from "../../ExecutionNode";
import fs from 'fs'

export interface ToolInvokeExecutioNodeInputState {
    toolId: string
    toolParams: any
}

export interface ToolInvokeExecutionNodeResultState {
    toolResult: any
}

export class ToolInvokeExecutionNode extends ExecutionNode<ToolInvokeExecutioNodeInputState, ToolInvokeExecutionNodeResultState> {

    public constructor () {
        super(EventType.TOOL_INVOKE)
    }

    protected async invokeInternal (context: ExecutionContext<ToolInvokeExecutioNodeInputState>) {
        
        const toolObj = await DB.tools.get(context.state.toolId)
        const settings = await DB.settings.getSettings()
        const workspace = settings.executionWorkspace
        const runId = Math.random().toString(36).substring(7)
        const wsString = `${workspace}/tool-${runId}`
        const input = `${wsString}/input.json`
        const result = `${wsString}/result.json`

        await context.recordRelatedRecord(context.state.toolId)

        fs.mkdirSync(wsString, { recursive: true })
        fs.writeFileSync(input, JSON.stringify({
            toolId: context.state.toolId,
            tool: toolObj.name,
            params: context.state.toolParams
        }))

        if (toolObj.toolType == ToolIntegrationType.NODEJS_SCRIPT) {
            await InvokeNodeJSTool(context.state.toolId, wsString)
        }

        const toolResult = JSON.parse(fs.readFileSync(result).toString())
        await context.completeWithData(wsString)
        return context.mergeState({toolResult})

    }
}