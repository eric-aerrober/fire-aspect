import { FRAMEWORK } from "../../orchestration/framework";
import { ConversationType } from "../apis/conversation_table";
import { EventType } from "../apis/events_table";
import { DB } from "../database";
import { Status } from "../enums";

interface CreateNewWithChatModel {
    modelId: string;
    initialChat: string;
}

export async function CreateNewWithChatModel (data: CreateNewWithChatModel) {
    
    // Create conversation
    const conversation = await DB.conversations.create({
        sourceId: data.modelId,
        conversationType: ConversationType.CHAT_MODEL,
        name: data.initialChat
    })

    // Add initial message
    const message = await DB.events.create({
        parentId: conversation.id,
        type: EventType.USER_CHAT_MESSAGE,
        relatedRecords: '',
        content: data.initialChat,
        status: Status.SUCCESS
    })

    // Create summary
    FRAMEWORK.workflows.ChatGetsTitledWorkflow(conversation.id).then(title => {
        DB.conversations.update({ id: conversation.id, name: title })
    })

    // Return conversation
    return conversation;

}

interface UserAddChatMessage {
    conversationId: string;
    message: string;
}

export async function UserAddChatMessage (data: UserAddChatMessage) {

    const message = await DB.events.create({
        parentId: data.conversationId,
        type: EventType.USER_CHAT_MESSAGE,
        relatedRecords: '',
        content: data.message,
        status: Status.SUCCESS
    })

    return message;
}