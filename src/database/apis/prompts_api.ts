import { APIWrapper } from "../api_wrapper";
import { PromptsDefinedTable, PromptsDefinedTableElement } from "./prompts_table";

export class PromptsApi extends APIWrapper<PromptsDefinedTableElement, typeof PromptsDefinedTable> {
}
