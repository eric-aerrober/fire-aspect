import { EventType } from "../../../../database/apis/events_table";
import { ExecutionContext } from "../../ExecutionContext";
import { ExecutionNode } from "../../ExecutionNode";
import fs from 'fs'
import { ChatModelRespondExecutionNode } from "../ChatModelRespondNode";
import { PromptStore } from "../../../prompts/PromptStore";
import { extractObject } from "../../../utils/strings";

export interface DescribeWorkspaceFileInputState {
    filePath: string
}

interface SummaryResponse {
    fileSummary: string
}

export interface DescribeWorkspaceFileOutputState {
    fileSummary: string
}

export class DescribeWorkspaceFileNode extends ExecutionNode<DescribeWorkspaceFileInputState, DescribeWorkspaceFileOutputState> {

    private static PROMPT = new PromptStore('base-tools-files')

    public constructor () {
        super(EventType.TOOL_INVOKE)
    }

    protected async invokeInternal (context: ExecutionContext<DescribeWorkspaceFileInputState>) {
        
        const fileContent = await fs.promises.readFile(context.state.filePath, 'utf-8')
        const sumaryPrompt = await DescribeWorkspaceFileNode.PROMPT.loadPrompt('sumarize-file', {fileContent})

        const askedMode = await new ChatModelRespondExecutionNode()
            .invoke(context.addUserMessage(sumaryPrompt))

        const parsedData = extractObject<SummaryResponse>(askedMode.state.chatResponse)

        if (!parsedData) {
            throw new Error('Unable to parse response')
        }

        return context.mergeState({
            fileSummary: parsedData.fileSummary
        })

    }

}