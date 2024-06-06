import { EventType } from "../../../database/apis/events_table";
import { extractObject } from "../../utils/strings";
import { ExecutionContext } from "../ExecutionContext";
import { ExecutionNode } from "../ExecutionNode";

export class ChatModelObjectResponseNode<T> extends ExecutionNode<unknown, T> {

    public constructor () {
        super(EventType.CHAT_MODEL_RESPOND_MESSAGE)
    }

    protected async invokeInternal<IncommingState> (context: ExecutionContext<IncommingState>) {
        
        const targetChatModel = context.integrations.conversationalChatModel;

        const modelInvokeResult = await targetChatModel.invoke({
            messages: context.getConversationHistory()
        })

        await context.referToRelatedRecord(modelInvokeResult.invokeRecord.id)

        let resultObject = extractObject<T>(modelInvokeResult.output.message)
        if (!resultObject) {
            throw new Error('Unable to parse response')
        }

        return context.mergeState(resultObject)
    }
}