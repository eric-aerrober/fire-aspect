import { useEffect, useState } from "react"
import { Center } from "../../components/layout/Center"
import { IntegrationTableElement } from "../../database/apis/integrations_table"
import { useListenTableItems } from "../../database/hooks"
import { ModelIntegrationType } from "../../orchestration/models/ModelIntegrationOptions"
import { InputBox } from "../../components/inputs/InputBox"
import Chat from 'remixicon-react/Chat1LineIcon'
import { SelectOneOf } from "../../components/inputs/Select"
import { ACTIONS } from "../../database/actions"
import { useNavigate } from "react-router"
import { FRAMEWORK } from "../../orchestration/framework"
import { AgentsTableElement } from "../../database/apis/agents_table"
import { AgentIcon } from "../../components/logos/robot"

export function CreateNewAgentChatPage () {

    const nav = useNavigate()
    const definedAgents = useListenTableItems<AgentsTableElement>('agents') || []
    const [chosenAgent, setChosenAgent] = useState<string>()

    const agentModelOptions = definedAgents.map(agent => ({
        id: agent.id,
        render: agent.name
    }))

    useEffect(() => {
        if (agentModelOptions.length > 0 && !chosenAgent) {
            setChosenAgent(agentModelOptions[0].id)
        }
    }, [definedAgents])

    if (!definedAgents) return <div>Loading...</div>

    const onSend = (text: string) => {
        ACTIONS.CreateNewWithChatAgent({
            agentId: chosenAgent!,
            initialChat: text
        }).then((conversation) => {
            nav(`/conversations/${conversation.id}`)
            FRAMEWORK.workflows.AgentRespondToUserWorkflow(conversation.id)
        })
    }

    return <Center>
        <div className="flex flex-col items-center gap-4">
            <div className="w-14">
                <AgentIcon />
            </div>
            <div className="w-[300px]">
                <SelectOneOf
                    selected={chosenAgent}
                    label="Choose a chat agent" 
                    options={agentModelOptions} 
                    onSelect={setChosenAgent} />
            </div>
            <div className="w-[600px]">
                <InputBox onSend={onSend} />
            </div>
        </div>
    </Center>
}