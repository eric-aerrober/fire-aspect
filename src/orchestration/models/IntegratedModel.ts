import { ModelInvokeTableElement } from "../../database/apis/model_invoke_table";
import { DB } from "../../database/database";
import { Status } from "../../database/enums";
import { hashObject } from "../utils/strings";
import { IntegratedModel, ModelIntegrationType } from "./ModelIntegrationOptions";

export interface ModelResult<T> {
    output: T,
    cacheHit: boolean,
    invokeRecord: ModelInvokeTableElement
}

export class ModelIntegration <InputType, OutputType, OutputTypeInternal> {

    private modelId: IntegratedModel;
    private modelType: ModelIntegrationType;

    constructor (modelId: IntegratedModel, modelType: ModelIntegrationType) {
        this.modelId = modelId;
        this.modelType = modelType;
    }

    public getModelId () {
        return this.modelId;
    }

    public async invoke (invokeParams: InputType) : Promise<ModelResult<OutputType>> {
        const inputHash = hashObject(invokeParams);
        const exists = await DB.modelInvokes.getByHash(inputHash);

        if (exists) {
            return {
                output: JSON.parse(exists.resultRaw),
                cacheHit: true,
                invokeRecord: exists
            }
        }

        const start = Date.now();
        const invokeRecord = await DB.modelInvokes.create({
            modelId: this.modelId,
            modelType: this.modelType,
            inputRaw: JSON.stringify(invokeParams),
            resultRaw: JSON.stringify({}),
            status: Status.INPROGRESS
        });

        const invokeObject = await this.invokeModelType(invokeParams);

        await DB.modelInvokes.update({
            id: invokeRecord.id,
            resultRaw: JSON.stringify(invokeObject),
            status: Status.SUCCESS,
            invokeTime: Date.now() - start
        });

        return {
            output: invokeObject,
            cacheHit: false,
            invokeRecord: invokeRecord
        }
    }

    protected async invokeModelType (invokeParams: InputType): Promise<OutputType> {
        throw new Error('Not implemented');
    }
    
    protected async invokeSpeciedModel (invokeParams: InputType): Promise<OutputTypeInternal> {
        throw new Error('Not implemented');
    }

}