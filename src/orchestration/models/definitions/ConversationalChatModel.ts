import { ConversationHistoryMessage } from "../../executions/ExecutionContext";
import { ModelIntegration } from "../IntegratedModel";
import { IntegratedModel, ModelIntegrationType } from "../ModelIntegrationOptions";

export interface InvokeConversationalChatModel {
    messages: ConversationHistoryMessage[]
}

export interface ConversationalChatModelOutputInternal {
    message: string
}

export interface ConversationalChatModelOutput {
    message: string
    json: any
}

export class ConversationalChatModel extends ModelIntegration<InvokeConversationalChatModel, ConversationalChatModelOutput, ConversationalChatModelOutputInternal>  {

    public constructor (modelId: IntegratedModel) {
        super(modelId, ModelIntegrationType.CONVERSATIONAL_CHAT)
    }

    protected async invokeModelType (invokeParams: InvokeConversationalChatModel) : Promise<ConversationalChatModelOutput> {
        const rawResponse = await this.invokeSpeciedModel(invokeParams);
        return {
            message: rawResponse.message,
            json: this.bestEffortJson(rawResponse.message)
        }
    }

    private bestEffortJson (input: string) {
        try {
            const firstChar = input.indexOf('{');
            const lastChar = input.lastIndexOf('}');
            const json = input.substring(firstChar, lastChar + 1);
            return JSON.parse(json);
        } catch (e) {
            return {};
        }
    }

}