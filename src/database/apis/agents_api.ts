import { APIWrapper } from "../api_wrapper";
import { AgentsTable, AgentsTableElement } from "./agents_table";

export class AgentsApi extends APIWrapper<AgentsTableElement, typeof AgentsTable> {}
