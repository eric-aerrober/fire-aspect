import { NodeJSLogo } from "../../components/logos/node";

export enum ToolOwnerType {
    USER = 'USER',
    SYSTEM = 'SYSTEM'
}

export enum ToolIntegrationType {
    NODEJS_SCRIPT = 'node-js-script',
    SYSTEM = 'system'
}

export const ToolIntegrationDefinitions = {
    [ToolIntegrationType.NODEJS_SCRIPT]: {
        id: ToolIntegrationType.NODEJS_SCRIPT,
        name: 'NodeJS Script',
        logo: NodeJSLogo,
        description: 'Run a local NodeJS script as a tool. The specified script will be executed with a single parameter which defines the execution environment. That environment includes a file called input.json which contains the parameters passed to the script and a file called result.json which contains the input for the invocation. The script should write the result of the invocation to the result.json file.',
        params: [
            {
                name: 'script',
                description: 'Path to NodeJS script'
            }
        ]
    }
}

