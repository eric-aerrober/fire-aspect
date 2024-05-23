import { LabeledSidebar } from "../../components/sidebar/LabeledSidebar";
import { LabeledSidebarOption } from "../../components/sidebar/LabeledSidebarOption";
import Chat from 'remixicon-react/Chat1LineIcon'
import { useListenTableItems } from "../../database/hooks";
import { ConversationTableElement, ConversationType } from "../../database/apis/conversation_table";
import { IconButton } from "../../components/inputs/Buttons";
import { LabeledSidebarActions } from "../../components/sidebar/LabeledSidebarActions";
import { useNavigate, useOutlet } from "react-router";
import { CreateNewChatPage } from "./chat-create-new-chat-page";
import { AgentIcon } from "../../components/logos/robot";

function renderConversations (conversations: ConversationTableElement[] ) {

    const chatIcon = Chat
    const agentIcon = AgentIcon

    return <>
        <br/>
        {
            conversations.map((conversationObj, index) => {
                return <LabeledSidebarOption
                    key={index}
                    icon={conversationObj.conversationType == ConversationType.CHAT_AGENT ? agentIcon : chatIcon}
                    label={conversationObj.name}
                    path={`/conversations/${conversationObj.id}`}
                />
            })
        }
    </>
}

function NewConversation () { 
    const nav = useNavigate()
    return <LabeledSidebarActions
        label="New Chat"
        actions={<div style={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
            <IconButton icon={<div className="w-6 h-6 -translate-y-0.5">
                <AgentIcon/>
                </div>} onClick={() => {
                nav('/conversations/new-agent')
            }} />   
            <IconButton icon={<Chat/>} onClick={() => {
                nav('/conversations/new-chat')
            }} />           
        </div>}
    />
}

export function ChatsPage () {
    
    const conversations = useListenTableItems<ConversationTableElement>('conversations')
    const outlet = useOutlet()

    if (!conversations) return <div>Loading...</div>

    return <LabeledSidebar outlet={!outlet && <CreateNewChatPage />}>
        <NewConversation />
        { conversations.length > 0 && renderConversations(conversations) }
    </LabeledSidebar>
}