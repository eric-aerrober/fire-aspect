import { IntegrationTableElement } from "../../database/apis/integrations_table";
import { ConversationalChatModel } from "./definitions/ConversationalChatModel";
import { IntegratedModel, ModelIntegrationType, typeForModel } from "./ModelIntegrationOptions";
import { ClaudeV3ConversationalChatModel } from "./implementations/ConversationalChatClaudeV3";
import { ClaudeV3BedrockConversationalChatModel } from "./implementations/ConversationalChatClaudeBedrock";

export interface ModelIntegrations {
    conversationalChatModel: ConversationalChatModel
}

export function BuildIntegrations (integrations: IntegrationTableElement[]) {

    const modelIntegrations: ModelIntegrations = {
        conversationalChatModel: new ConversationalChatModel(IntegratedModel.NONE)
    }

    integrations.forEach((integration) => {
        const type = typeForModel(integration.modelId)
        switch (type) {
            case ModelIntegrationType.CONVERSATIONAL_CHAT:
                switch (integration.modelId) {
                    case IntegratedModel.CLAUDE_3_OPUS:
                        modelIntegrations.conversationalChatModel = new ClaudeV3ConversationalChatModel(
                            integration.modelId,
                            integration.integrationParams!
                        );
                        break;
                    case IntegratedModel.CLAUDE_3_SONNET:
                        modelIntegrations.conversationalChatModel = new ClaudeV3ConversationalChatModel(
                            integration.modelId,
                            integration.integrationParams!
                        );
                        break;
                    case IntegratedModel.CLAUDE_3_HAIKU:
                        modelIntegrations.conversationalChatModel = new ClaudeV3ConversationalChatModel(
                            integration.modelId,
                            integration.integrationParams!
                        );
                        break;
                    case IntegratedModel.BEDROCK_CLAUDE_3_SONNET:
                        modelIntegrations.conversationalChatModel = new ClaudeV3BedrockConversationalChatModel(
                            integration.modelId,
                            integration.integrationParams!
                        );
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    })

    return modelIntegrations;

}