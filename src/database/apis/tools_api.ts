import { APIWrapper } from "../api_wrapper";
import { ToolDefinedTable, ToolDefinedTableElement } from "./tools_table";

export class ToolApi extends APIWrapper<ToolDefinedTableElement, typeof ToolDefinedTable> {
}
