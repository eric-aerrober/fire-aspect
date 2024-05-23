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

export function CreateNewChatPage () {

    const nav = useNavigate()
    const integratedModels = useListenTableItems<IntegrationTableElement>('integrations')
    const [chosenModel, setChosenModel] = useState<string>()

    const chatModels = (integratedModels || [])
        .filter(model => model.integrationType == ModelIntegrationType.CONVERSATIONAL_CHAT);

    const chatModelOptions = chatModels.map(model => ({
        id: model.id,
        render: model.name
    }))

    useEffect(() => {
        if (chatModelOptions.length > 0 && !chosenModel) {
            setChosenModel(chatModelOptions[0].id)
        }
    }, [chatModels])

    if (!integratedModels) return <div>Loading...</div>

    const onSend = (text: string) => {
        ACTIONS.CreateNewWithChatModel({
            modelId: chosenModel!,
            initialChat: text
        })
            .then((conversation) => {
                nav(`/conversations/${conversation.id}`)
                FRAMEWORK.workflows.ChatModelRespondToConversationWorkflow(conversation.id)
            })
    }

    return <Center>
        <div className="flex flex-col items-center gap-4">
            <Chat size={60} />
            <div className="w-[300px]">
                <SelectOneOf
                    selected={chosenModel}
                    label="Choose a chat model" 
                    options={chatModelOptions} 
                    onSelect={setChosenModel} />
            </div>
            <div className="w-[600px]">
                <InputBox onSend={onSend} />
            </div>
        </div>
    </Center>
}