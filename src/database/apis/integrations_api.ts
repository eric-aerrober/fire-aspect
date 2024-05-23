import { APIWrapper } from "../api_wrapper";
import { IntegrationTableElement, IntegrationsTable } from "./integrations_table";

export class IntegrationsAPI extends APIWrapper<IntegrationTableElement, typeof IntegrationsTable> {}