import { useNavigate, useParams } from "react-router-dom";
import { CenterPage } from "../../components/layout/Center";
import { PageScafold } from "../../components/layout/PageScafold";
import { useListenItem, useListenQuery, useListenTableItems } from "../../database/hooks";
import { ToolDefinedTableElement } from "../../database/apis/tools_table";
import { DB } from "../../database/database";
import { ModelIntegrationType } from "../../orchestration/models/ModelIntegrationOptions";
import { LabeldInputOption } from "../../components/inputs/LabeledInputOption";
import { AgentsTableElement } from "../../database/apis/agents_table";
import { Label } from "../../components/key-value";
import { Textarea } from "@tremor/react";
import CheckIcon from 'remixicon-react/CheckLineIcon'
import { SelectOneOf } from "../../components/inputs/Select";
import { IntegrationTableElement } from "../../database/apis/integrations_table";

export function AgentsConfigurePage () {
    
    const {id} = useParams();
    const nav = useNavigate();

    const agentWithId = useListenItem<AgentsTableElement>('agents', id);
    const integratedModels = useListenTableItems<IntegrationTableElement>('integrations')
    const currentToolsUser = useListenQuery<ToolDefinedTableElement[]>('tools', () => DB.tools.userCreated(), []);
    const currentToolsSystem = useListenQuery<ToolDefinedTableElement[]>('tools', () => DB.tools.systemCreated(), []);
    const defiendAgents = useListenTableItems<AgentsTableElement>('agents')

    const chatModels = (integratedModels || [])
        .filter(model => model.integrationType == ModelIntegrationType.CONVERSATIONAL_CHAT);

    const chatModelOptions = chatModels.map(model => ({
        id: model.id,
        render: model.name
    }))

    if (!id) {
        nav('/agents')
        return <div>Invalid Integration</div>
    }

    if (!agentWithId || !integratedModels || !currentToolsUser ||!currentToolsSystem || !defiendAgents)
        return <div>Loading...</div>

    function RenderTools (tools: ToolDefinedTableElement[]) {
        if (tools.length == 0) return <div><br/><br/></div>
        return tools.map((tool) => {
            const toolsParsed: string[] = JSON.parse(agentWithId!.tools || '[]')
            const checked = toolsParsed.includes(tool.id)
            return <div key={tool.id} className={
                `flex items-center rounded border-gray-100 hover:border-gray-300 border p-2 cursor-pointer w-fit capitalize px-3 ${checked ? 'bg-indigo-100 ' : ''}`
            } onClick={() => {
                if (checked) {
                    DB.agents.update({id: id!, tools: JSON.stringify(toolsParsed.filter(t => t != tool.id))})
                } else {
                    DB.agents.update({id: id!, tools: JSON.stringify([...toolsParsed, tool.id])})
                }
            }}> 
                <div className="mr-2">
                    { checked ? <CheckIcon size={20} color="purple" /> : <CheckIcon size={20} color="lightgray" /> }
                </div>
                {tool.name}
            </div>
        })
    }

    return <CenterPage width="1000px">
        <PageScafold 
            title={`Configuring Agent: ${agentWithId.name}`}
            breadcrumbs={[
                {name: 'Agents', href: '/agents'},
                {name: 'Configure', href: '/agents/' + id}
            ]}
        >

            <LabeldInputOption
                label="Name of Agent"
                value={agentWithId.name || ''}
                onValueChange={(a) => DB.agents.update({id, name: a})}
                placeholder="Name"
            />
            <SelectOneOf
                selected={agentWithId.modelId || 'none'}
                label="Choose a chat model" 
                options={chatModelOptions} 
                onSelect={option => DB.agents.update({id, modelId: option})}
            />
            
            <Label label="System Prompt" />
            <Textarea
                value={agentWithId.systemPrompt || ''}
                onValueChange={(value) => DB.agents.update({id, systemPrompt: value})}
                placeholder="System Prompt"
                rows={10}
            />

            <br/>
            <Label label="Accessable User Tools" />
            <div className="flex gap-2">
            {
                RenderTools(currentToolsUser)
            }
            </div>

            <Label label="Accessable System Tools" />
            <div className="flex gap-2">
            {
                RenderTools(currentToolsSystem)
            }
            </div>  

            <br/>

            <Label label="Accessable Agents" />
            <div className="flex gap-2">
            {
                defiendAgents.map((agent) => {
                    const agentsParsed: string[] = JSON.parse(agentWithId.subAgents || '[]')
                    const checked = agentsParsed.includes(agent.id)
                    return <div key={agent.id} className={
                        `flex items-center rounded border-gray-100 hover:border-gray-300 border p-2 cursor-pointer w-fit capitalize px-3 ${checked ? 'bg-indigo-100 ' : ''}`
                    } onClick={() => {
                        if (checked) {
                            DB.agents.update({id, subAgents: JSON.stringify(agentsParsed.filter(t => t != agent.id))})
                        } else {
                            DB.agents.update({id, subAgents: JSON.stringify([...agentsParsed, agent.id])})
                        }
                    }}> 
                        <div className="mr-2">
                            { checked ? <CheckIcon size={20} color="purple" /> : <CheckIcon size={20} color="lightgray" /> }
                        </div>
                        {agent.name}
                    </div>
                })
            }
            </div>

            

        </PageScafold>
    </CenterPage>

}