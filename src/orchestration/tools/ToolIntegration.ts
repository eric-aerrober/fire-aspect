export interface ToolIntegrations {
    [toolId: string]: {
        name: string
        description: string
        toolType: string
        config: any,
        params: {
            name: string
            description: string
        }[]
    }
}

export function describeTools (integrations: ToolIntegrations) {
    const describeTool = (toolId: string) => {
        const tool = integrations[toolId]
        return `
            Id: ${toolId}
            Name: ${tool.name}
            Description: ${tool.description}
            Params: ${JSON.stringify(tool.params)}
        `
    }

    return Object.keys(integrations).map(describeTool).join('\n\n')

}