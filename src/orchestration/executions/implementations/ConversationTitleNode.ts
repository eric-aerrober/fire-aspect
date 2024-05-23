import { EventType } from "../../../database/apis/events_table";
import { ExecutionContext } from "../ExecutionContext";
import { ExecutionNode } from "../ExecutionNode";

export interface ModelTitlesConversationExecutionNodeResultState {
    conversationTitle: string
}

export class ModelTitlesConversationExecutionNode extends ExecutionNode<unknown, ModelTitlesConversationExecutionNodeResultState> {

    public constructor () {
        super(EventType.CHAT_MODEL_RESPOND_MESSAGE)
    }

    protected async invokeInternal<IncommingState> (context: ExecutionContext<IncommingState>) {
        
        const targetChatModel = context.integrations.conversationalChatModel;
        const conversationAsString = JSON.stringify(context.getConversationHistory())

        const modelInvokeResult = await targetChatModel.invoke({
            messages: [
                {
                    sender: 'user',
                    message: `
                    
                        ${conversationAsString}

                        The above conversation is a conversation between a user and a chatbot.
                        You're job is to provide a title for this conversation that can be displayed in the UI for the user to see.

                        Example titles you can use as reference:
                        - "User wants help writing for loop in java where variables are not incrementing"
                        - "User is facing issues with the login page"
                        - "Workflow running slow, user wants to know why"
                    
                        Respond in the following format:

                        {
                            "title": "title here"
                        }
                    
                    `
                }
            ]
        })

        await context.referToRelatedRecord(modelInvokeResult.invokeRecord.id)
        return context.mergeState({conversationTitle: modelInvokeResult.output.json.title})
    }
}