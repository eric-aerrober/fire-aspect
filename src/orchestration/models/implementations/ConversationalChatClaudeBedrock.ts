import { ConversationalChatModel, ConversationalChatModelOutput, ConversationalChatModelOutputInternal, InvokeConversationalChatModel } from "../definitions/ConversationalChatModel";
import { IntegratedModel } from "../ModelIntegrationOptions";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const integrationToModelId : any = {
    [IntegratedModel.BEDROCK_CLAUDE_3_SONNET]: 'anthropic.claude-3-sonnet-20240229-v1:0',
}

export class ClaudeV3BedrockConversationalChatModel extends ConversationalChatModel {
    
    private accessKeyId: string;
    private secretAccessKey: string;

    constructor (modelId: IntegratedModel, params: any) {
        super(modelId);
        this.accessKeyId = (JSON.parse(params))['Access Key ID'];
        this.secretAccessKey = (JSON.parse(params))['Secret Access Key'];
    }

    protected async invokeSpeciedModel (invokeParams: InvokeConversationalChatModel) : Promise<ConversationalChatModelOutputInternal> {
        
        const bedrockClient = new BedrockRuntimeClient({ region: 'us-east-1', 
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey
            }
        });

        const invokeModelCommand = new InvokeModelCommand({
            body: Buffer.from(JSON.stringify({
                anthropic_version: 'bedrock-2023-05-31',
                max_tokens: 3000,
                messages: invokeParams.messages.map(message => ({
                    role: message.sender === 'user' ? 'user' : 'assistant',
                    content: [
                        {
                            type: 'text',
                            text: message.message
                        }
                    ]
                })),
            })),
            contentType: 'application/json',
            accept: 'application/json',
            modelId: integrationToModelId[this.getModelId()],
        });
        const invokeModelOutput = await bedrockClient.send(invokeModelCommand);
        const resultString = Buffer.from(invokeModelOutput.body as Uint8Array).toString('utf-8');
        const result = JSON.parse(resultString);

        return {
            message: result.content[0].text
        }
    }
    
}