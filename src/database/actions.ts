import { CreateNewWithChatAgent } from "./actions/conversation-agent";
import { CreateNewWithChatModel, UserAddChatMessage } from "./actions/conversation-model";

export const ACTIONS = {
    CreateNewWithChatModel: CreateNewWithChatModel,
    UserAddChatMessage: UserAddChatMessage,
    CreateNewWithChatAgent: CreateNewWithChatAgent,
}