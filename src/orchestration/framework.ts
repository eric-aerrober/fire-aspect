import { AgentRespondToUserWorkflow } from "./workflows/AgentRespondsUser";
import { ChatGetsTitledWorkflow, ChatModelRespondToConversationWorkflow } from "./workflows/ChatModelRespondWorkflow";

export const FRAMEWORK = {
    workflows: {
        ChatModelRespondToConversationWorkflow,
        ChatGetsTitledWorkflow,
        AgentRespondToUserWorkflow
    }
}