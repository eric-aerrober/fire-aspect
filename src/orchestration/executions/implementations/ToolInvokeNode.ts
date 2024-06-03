import { EventType } from "../../../database/apis/events_table";
import { DB } from "../../../database/database";
import { ToolIntegrationType } from "../../tools/ToolIntegrationOptions";
import { InvokeNodeJSTool } from "../../tools/implementations/user-defined/nodejs";
import { ExecutionContext } from "../ExecutionContext";
import { ExecutionNode } from "../ExecutionNode";
import fs from 'fs'
import { ExecutionVariable } from "../ExecutionVariable";
import { randomId } from "../../../database/utils";
import { CreateEnvironmentTool } from "../../tools/implementations/system-tools/CreateEnv";
import { WriteFileToEnvTool } from "../../tools/implementations/system-tools/WriteFile";

export interface ToolInvokeExecutioNodeInputState {
    toolId: string
    toolParams: any
}

export interface ToolInvokeExecutionNodeResultState {
    tool: {
        id: string
        response: string
        data: any
        variables: {
            variable: string
            description: string
            type: string
        }[]
    }
}

export interface ToolInvokedResultObject {
    response: string
    data: any
    variables: ExecutionVariable[]
}

export class ToolInvokeExecutionNode extends ExecutionNode<ToolInvokeExecutioNodeInputState, ToolInvokeExecutionNodeResultState> {

    public constructor () {
        super(EventType.TOOL_INVOKE)
    }

    protected async invokeInternal (context: ExecutionContext<ToolInvokeExecutioNodeInputState>) {
        
        const toolObj = await DB.tools.get(context.state.toolId)
        const settings = await DB.settings.getSettings()
        const workspace = settings.executionWorkspace
        const runId = randomId()
        const wsString = `${workspace}/tools/tool-${runId}`
        const input = `${wsString}/input.json`
        const result = `${wsString}/result.json`

        await context.recordRelatedRecord(context.state.toolId)

        // Inject variables into the params
        let stringified = JSON.stringify(context.state.toolParams);
        const injectabe = context.getVariables()
        for (const variable of injectabe) {
            stringified = stringified.replaceAll(`\$${variable}`, context.getVariable(variable).value)
        }
        const injectedParams = JSON.parse(stringified)

        // Write the input file
        await fs.promises.mkdir(wsString, { recursive: true })
        await fs.promises.writeFile(input, JSON.stringify({
            toolId: context.state.toolId,
            tool: toolObj.name,
            params: injectedParams
        }, null, 2))

        // Actually invoke the tool
        await this.invokeToolHandler(toolObj, context, wsString)

        // Read the result and complete the execution
        const fileRead = await fs.promises.readFile(result)
        const toolResult : ToolInvokedResultObject = JSON.parse(fileRead.toString('utf-8'))
        await context.completeWithData(wsString)

        // Consume variables and merge results
        const variables = toolResult.variables.map(v => context.constructVariable(v))
        return context
            .withVariables(variables)
            .mergeState({
                tool: {
                    id: context.state.toolId,
                    response: toolResult.response,
                    data: toolResult.data,
                    variables: variables.map(v => ({
                        variable: v.name,
                        description: v.description,
                        type: v.type
                    }))
                }
            })
    }

    protected invokeToolHandler (toolObj: any, context: ExecutionContext<ToolInvokeExecutioNodeInputState>, wsString: string) {

        // First, is this a system tool
        if (toolObj.toolType == ToolIntegrationType.SYSTEM) {

            if (toolObj.name == 'create-env') {
                console.log('Creating environment')
                return CreateEnvironmentTool(wsString)
            }

            if (toolObj.name == 'write-file') {
                console.log('Writing file')
                return WriteFileToEnvTool(wsString)
            }
        }

        // Else, do we know how to handle it?
        if (toolObj.toolType == ToolIntegrationType.NODEJS_SCRIPT) {
            return InvokeNodeJSTool(context.state.toolId, wsString)
        }

        // Else, we don't know how to handle it
        throw new Error(`Tool type ${toolObj.toolType} is not supported`)
    }
}