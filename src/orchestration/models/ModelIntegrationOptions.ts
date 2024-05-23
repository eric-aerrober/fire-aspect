import { AnthropicLogo } from "../../components/logos/anthropic";
import { AWSLogo } from "../../components/logos/aws";

export enum ModelIntegrationType {
    CONVERSATIONAL_CHAT = 'conversational-chat',
}

export enum IntegratedModel {
    CLAUDE_3_OPUS = 'claude-3-opus',
    CLAUDE_3_SONNET = 'claude-3-sonnet',
    CLAUDE_3_HAIKU = 'claude-3-haiku',
    BEDROCK_CLAUDE_3_SONNET = 'aws-claude-3-sonnet',
    NONE = 'none'
}

export const PossibleIntegrations = {
    [ModelIntegrationType.CONVERSATIONAL_CHAT]: [
        {
            name: 'Claude V3 Opus',
            id: IntegratedModel.CLAUDE_3_OPUS,
            logo: AnthropicLogo,
            description: 'Connect to the claude opus model through anthropics official api',
            params: ['Api Key']
        },
        {
            name: 'Claude V3 Sonnet',
            id: IntegratedModel.CLAUDE_3_SONNET,
            logo: AnthropicLogo,
            description: 'Connect to the claude opus model through anthropics official api',
            params: ['Api Key']
        },
        {
            name: 'Claude V3 Haiku',
            id: IntegratedModel.CLAUDE_3_HAIKU,
            logo: AnthropicLogo,
            description: 'Connect to the claude opus model through anthropics official api',
            params: ['Api Key']
        },
        {
            name: 'Claude V3 Sonnet',
            id: IntegratedModel.BEDROCK_CLAUDE_3_SONNET,
            logo: AWSLogo,
            description: 'Connect to the claude opus model through AWS Bedrock integration. Uses the credentials from your local environment.',
            params: ['Access Key ID', 'Secret Access Key']
        }
    ]
}

export const typeForModel = (model: IntegratedModel) => {
    for (const key in PossibleIntegrations) {
        const integrations = PossibleIntegrations[key as ModelIntegrationType];
        for (const integration of integrations) {
            if (integration.id === model) {
                return key as ModelIntegrationType;
            }
        }
    }
}

export const integrationDefinedForModel = (model: IntegratedModel) => {
    for (const key in PossibleIntegrations) {
        const integrations = PossibleIntegrations[key as ModelIntegrationType];
        for (const integration of integrations) {
            if (integration.id === model) {
                return integration;
            }
        }
    }
}