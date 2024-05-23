import { EventType } from "../../../database/apis/events_table";
import { ExecutionContext } from "../ExecutionContext";
import { ExecutionNode } from "../ExecutionNode";

export interface ChatModelRespondExecutionNodeResultState {
    chatResponse: string
}

export class ChatModelRespondExecutionNode extends ExecutionNode<unknown, ChatModelRespondExecutionNodeResultState> {

    public constructor () {
        super(EventType.CHAT_MODEL_RESPOND_MESSAGE)
    }

    protected async invokeInternal<IncommingState> (context: ExecutionContext<IncommingState>) {
        
        const targetChatModel = context.integrations.conversationalChatModel;

        const modelInvokeResult = await targetChatModel.invoke({
            messages: context.getConversationHistory()
        })

        await context.referToRelatedRecord(modelInvokeResult.invokeRecord.id)
        return context.mergeState({chatResponse: modelInvokeResult.output.message})
    }
}