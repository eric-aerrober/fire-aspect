import { useNavigate, useParams } from "react-router";
import { useListenItem, useListenQuery } from "../../database/hooks";
import { DB } from "../../database/database";
import { ChatSection } from "./chat-section";
import { EventTableElement } from "../../database/apis/events_table";
import { Center, CenterPage } from "../../components/layout/Center";
import { PageScafold } from "../../components/layout/PageScafold";
import { InputBox } from "../../components/inputs/InputBox";
import { ACTIONS } from "../../database/actions";
import { ConversationTableElement, ConversationType } from "../../database/apis/conversation_table";
import { IntegrationTableElement } from "../../database/apis/integrations_table";
import { IconButton } from "../../components/inputs/Buttons";
import { AgentIcon, BrainIcon, NeuralNetIcon } from "../../components/logos/robot";
import { FRAMEWORK } from "../../orchestration/framework";
import { AgentsTableElement } from "../../database/apis/agents_table";

export function ChatRenderedPage () {
 
    const {id} = useParams();
    const nav = useNavigate();
    const conversation = useListenItem<ConversationTableElement>('conversations', id)
    const conversationEvents = useListenQuery('events', () => DB.events.allFromConversation(id!), [id])
    const conversationsChatSource = useListenItem<IntegrationTableElement>('integrations', conversation?.sourceId!)
    const conversationsAgentSource = useListenItem<AgentsTableElement>('agents', conversation?.sourceId!)

    const source = conversationsChatSource || conversationsAgentSource
    const SourceIcon = conversation?.conversationType == ConversationType.CHAT_MODEL ? BrainIcon : () => <div className="w-6"> <AgentIcon/> </div>

    if (!id) return <div>Invalid Chat</div>
    if (!conversationEvents || !conversation || !source) return <div>Loading...</div>

    const onSend = async (text: string) => {
        await ACTIONS.UserAddChatMessage({ conversationId: id!, message: text })

        if (conversation.conversationType == ConversationType.CHAT_MODEL)
            FRAMEWORK.workflows.ChatModelRespondToConversationWorkflow(id!)
        else if (conversation.conversationType == ConversationType.CHAT_AGENT)
            FRAMEWORK.workflows.AgentRespondToUserWorkflow(id!)
    }
    
    return <CenterPage width="1200px">
        <PageScafold 
            title={`${conversation.name || 'Conversation'}`} 
            actionsRight={
                <IconButton text={source.name!} icon={<SourceIcon/>} onClick={() => {
                    if (conversation.conversationType == ConversationType.CHAT_AGENT)
                        nav(`/database/agents/${conversation.sourceId}`)
                    else
                        nav(`/database/integrations/${conversation.sourceId}`)
                }} />
            }
        >
            <div style={{
                padding: '0',
                height: 'calc(100vh - 140px)',
                position: 'relative',
            }}>
                <div className="flex flex-col space-y-4 pb-[400px] overflow-y-auto" style={{height: 'calc(100% - 120px)'}}>
                    {
                        conversationEvents.map((event, index) => {
                            return <ChatSection key={index} event={event as EventTableElement} />
                        })
                    }
                </div>
                <div className="absolute -bottom-8 bg-white p-4 w-full">
                    <InputBox onSend={onSend} disabled={!!conversation.blockingEventId} />
                </div>
            </div>
        </PageScafold>
    </CenterPage>
        
}