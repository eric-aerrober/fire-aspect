import { EventType } from "../../../../database/apis/events_table";
import { WorkspaceTraverser } from "../../../utils/WorkspaceTraverser";
import { ExecutionContext } from "../../ExecutionContext";
import { ExecutionNode } from "../../ExecutionNode";
import fs from 'fs'
import { ChatModelRespondExecutionNode } from "../ChatModelRespondNode";
import { DescribeWorkspaceFileNode } from "./DescribeFileTool";
import { PromptStore } from "../../../prompts/PromptStore";
import { extractObject } from "../../../utils/strings";
import { ChatModelObjectResponseNode } from "../ChatModelObjectNode";

export interface DescribeWorkspaceInputState {
    workspaceId: string
    goalForTraversal: string
}

export interface DescribeWorkspaceOutputState {
    workspaceDescribed: string
}

interface ModelFileActionResult {
    action: string
    filePath: string
}

export class DescribeWorkspaceToolNode extends ExecutionNode<DescribeWorkspaceInputState, DescribeWorkspaceOutputState> {

    private static PROMPT = new PromptStore('base-tools-files')

    public constructor () {
        super(EventType.TOOL_INVOKE)
    }

    protected async invokeInternal (context: ExecutionContext<DescribeWorkspaceInputState>) {
        
        const workspacePath = context.state.workspaceId

        // Capture prompts
        const actionPrompt = await DescribeWorkspaceToolNode.PROMPT.loadPrompt('choose-file-action', {
            goal: context.state.goalForTraversal})
        const systemPrompt = await DescribeWorkspaceToolNode.PROMPT.loadPrompt('system', {
            goal: context.state.goalForTraversal
        })

        // Called for each file in the workspace that the model wants to summarize
        const onSummarizeFile = async (filePath: string) => {
            const askNode = await new DescribeWorkspaceFileNode()
                .invoke(context.mergeState({filePath}).clearMessages())
            return askNode.state.fileSummary
        }

        // Class to handle the traversal of the workspace and what we have seen and not seen
        const traverser = new WorkspaceTraverser(workspacePath, onSummarizeFile);
        await traverser.open('')
        const describedData = traverser.describeWorkspace();
        const sumarySoFar = await DescribeWorkspaceToolNode.PROMPT.loadPrompt('traversal-result', {
            directoryStructure: JSON.stringify(describedData.workspaceStructure, null, 2),
            fileContents: describedData.enumeratedFileString
        })

        // We are going to give the model up to 5 actions on this workspace to try to get a concrete sumary achieved for the user  
        let loopedContext = context
            .clearMessages()
            .addUserMessage(systemPrompt)
            .addUserMessage(sumarySoFar)

        for (let i = 0; i < 5; i++) {

            const actionChosen = await new ChatModelObjectResponseNode<ModelFileActionResult>()
                .invoke(loopedContext.addUserMessage(actionPrompt))

            if (actionChosen.state.action === 'exit') {
                break;
            } else if (actionChosen.state.action === 'summarize') {
                await traverser.summarize(actionChosen.state.filePath)
            } else if (actionChosen.state.action === 'open') {
                await traverser.open(actionChosen.state.filePath)
            } else if (actionChosen.state.action === 'read') {
                await traverser.read(actionChosen.state.filePath)
            } else {
                throw new Error('Unknown action')
            }

            // Update our state to refer to the new data
            const describedData = traverser.describeWorkspace();
            const sumaryAfterLoop = await DescribeWorkspaceToolNode.PROMPT.loadPrompt('traversal-result', {
                directoryStructure: JSON.stringify(describedData.workspaceStructure, null, 2),
                fileContents: JSON.stringify(describedData.enumeratedFileString, null, 2)
            })
            loopedContext = context
                .clearMessages()
                .addUserMessage(systemPrompt)
                .addUserMessage(sumaryAfterLoop)

        }

        return context.mergeState({
            workspaceDescribed: JSON.stringify(traverser.describeWorkspace(), null, 2)
        })

    }

}