import { ConversationalChatModel, ConversationalChatModelOutput, ConversationalChatModelOutputInternal, InvokeConversationalChatModel } from "../definitions/ConversationalChatModel";
import { IntegratedModel } from "../ModelIntegrationOptions";

const integrationToModelId = {
    [IntegratedModel.CLAUDE_3_OPUS]: 'claude-3-opus-20240229',
    [IntegratedModel.CLAUDE_3_SONNET]: 'claude-3-sonnet-20240229',
    [IntegratedModel.CLAUDE_3_HAIKU]: 'claude-3-haiku-20240307'
}

export class ClaudeV3ConversationalChatModel extends ConversationalChatModel {
    
    private apiKey: string;

    constructor (modelId: IntegratedModel, params: any) {
        super(modelId);
        this.apiKey = (JSON.parse(params))['Api Key'];
    }

    protected async invokeSpeciedModel (invokeParams: InvokeConversationalChatModel) : Promise<ConversationalChatModelOutputInternal> {
        const modelId =  this.getModelId() as keyof typeof integrationToModelId
        const modelString = integrationToModelId[modelId]
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01',
            },
            method: 'POST',
            body: JSON.stringify({
                model: modelString,
                messages: invokeParams.messages.map(message => ({
                    role: message.sender === 'user' ? 'user' : 'assistant',
                    content: [
                        {
                            type: 'text',
                            text: message.message
                        }
                    ]
                })),
                max_tokens: 3000,
            })
        })

        const responseJson = await response.json();
        
        return {
            message: responseJson.content[0].text,
        };
    }
    
}