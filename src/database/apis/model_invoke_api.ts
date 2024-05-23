import { APIWrapper } from "../api_wrapper";
import { ModelInvokeTable, ModelInvokeTableElement } from "./model_invoke_table";

export class ModelInvokeAPI extends APIWrapper<ModelInvokeTableElement, typeof ModelInvokeTable> {
    public async getByHash (hash: string) {
        return this.get(this.reference(hash))
    }
}
