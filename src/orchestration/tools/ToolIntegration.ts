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
        return {
            id: toolId,
            name: tool.name,
            description: tool.description,
            params: tool.params
        }
    }

    return JSON.stringify(
        Object.keys(integrations).map(describeTool),
        null,
        2
    )
}