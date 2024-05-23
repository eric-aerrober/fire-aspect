import { EventTableElement, EventType } from "../../database/apis/events_table"
import { ExecutionLogScalfold } from "./execution-log-scafold"
import { AISparklesIcon, AgentIcon, BrainIcon } from "../../components/logos/robot"
import UserIcon from "remixicon-react/UserLineIcon"
import UnkownIcon from "remixicon-react/QuestionnaireLineIcon"
import { useNavigate } from "react-router-dom"
import { useListenItem } from "../../database/hooks"
import Tool from 'remixicon-react/ToolsLineIcon'
import { ConversationTableElement } from "../../database/apis/conversation_table"
import Chat1LineIcon from "remixicon-react/Chat1LineIcon"

export interface ExecutionLogEntryProps {
    id: string
    topLevel?: boolean
    event: EventTableElement
    children: EventTableElement[]
}

export function ExecutionLogEntry (props: ExecutionLogEntryProps) {

    const event = props.event
    const id = props.id
    const type = id.split(':')[0]

    const baseProps : any = {
        id: props.event?.id,
        timestamp: props.event?.creationDate,
        children: props.event?.content,
        parentId: props.topLevel && props.event?.id,
        childEvents: !props.topLevel && props.children,
    }

    if (type === 'conversations') {
        return <RenderConversationEvent id={id} />
    }

    if (event.type == EventType.USER_CHAT_MESSAGE) {
        return <ExecutionLogScalfold
            {...baseProps}
            title="User Input"
            icon={<UserIcon size={24} />}
        />
    }

    if (event.type == EventType.CHAT_MODEL_RESPOND_MESSAGE) {
        return <ExecutionLogScalfold
            {...baseProps}
            title="Model Response"
            icon={<BrainIcon />}
        />
    }

    if (event.type == EventType.GENERATE_CONVERSATION_TITLE) {
        return <ExecutionLogScalfold
            {...baseProps}
            title="Generate title for this conversation"
            icon={<AISparklesIcon />}
        />
    }

    if (event.type == EventType.WORKFLOW_ROOT_EVENT) {
        return <ExecutionLogScalfold
            {...baseProps}
            title="Defined Workflow Ran"
            icon={<AISparklesIcon />}
        />
    }

    if (event.type == EventType.AGENT_WORKFLOW) {
        return <ExecutionLogScalfold
            {...baseProps}
            title="Agentic Invoke"
            icon={<div className="w-6"><AgentIcon /></div>}
        />
    }

    if (event.type == EventType.TOOL_INVOKE) {
        return <ExecutionLogScalfold
            {...baseProps}
            title="Tool Invoked"
            icon={<Tool />}
        />
    }

    return <ExecutionLogScalfold
        {...baseProps}
        title={"Unknown Event: " + props.event.type}
        timestamp={props.event.creationDate}
        icon={<UnkownIcon size={24} />}
    />
}
function RenderConversationEvent (props: {id: string}) {

    const conversationItem = useListenItem<ConversationTableElement>('conversations', props.id)
    const nav = useNavigate()

    if (!conversationItem) return null

    return <ExecutionLogScalfold
        id={props.id}
        title="Conversation"
        timestamp={conversationItem.creationDate}
        icon={<Chat1LineIcon size={24} />}
        onClick={() => nav(`/conversations/${props.id}`)}
    >
        New conversation created about "{conversationItem.name}"
    </ExecutionLogScalfold>
}