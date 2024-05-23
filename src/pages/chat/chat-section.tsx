import { EventTableElement, EventType } from "../../database/apis/events_table";
import { Status } from "../../database/enums";
import { Spinner } from "../../components/layout/Spinner";
import Graph from 'remixicon-react/FlowChartIcon'
import { useNavigate } from "react-router-dom";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export interface ChatSectionProps {
    event: EventTableElement
}

interface ChatSectionScafoldProps {
    title: string
    children?: React.ReactNode
    status: Status
    relations?: React.ReactNode
    showEvent?: string
}

export function ChatSection (props: ChatSectionProps) {

    if (props.event.type === EventType.USER_CHAT_MESSAGE) {
        return <ChatSectionScafold 
            title="User" 
            status={props.event.status} 
            children={props.event.content} 
        />
    }

    if (props.event.type === EventType.CHAT_MODEL_RESPOND_MESSAGE) {
        return <ChatSectionScafold 
            title="Model" 
            status={props.event.status} 
            children={
                <Markdown remarkPlugins={[remarkGfm]}>{props.event.content}</Markdown>
            } 
            showEvent={props.event.id}
        />
    }

    if (props.event.type === EventType.WORKFLOW_ROOT_EVENT) {
        return <ChatSectionScafold 
            title="Workflow Result" 
            status={props.event.status} 
            children={props.event.content} 
            showEvent={props.event.id}
        />
    }

    if (props.event.type === EventType.GENERATE_CONVERSATION_TITLE) {
        return <ChatSectionScafold 
            title="Generating Conversation Title" 
            status={props.event.status} 
            showEvent={props.event.id}
        />
    }

    return <ChatSectionScafold 
        title={"Unknown Event: " + props.event.type} 
        status={props.event.status} 
        children={props.event.content} 
    />
} 

function ChatSectionScafold (props: ChatSectionScafoldProps) {
    const nav = useNavigate()

    return <div className="flex flex-col p-2 hover:bg-gray-50 rounded">
        <div className="text-sm text-gray-500 flex justify-between w-full">
            {props.title}
            <div>
                {
                    props.showEvent && <Graph 
                        size={24} 
                        color={'#ddd'} 
                        className="text-gray-500 hover:bg-black rounded p-1 cursor-pointer" 
                        key="graph-viz" 
                        onClick={() => nav(`/execution-log/${props.showEvent}`)} 
                    />
                }
                {props.relations}
            </div>
        </div>
        <div className="text-lg">
            {props.status === Status.INPROGRESS ? <Spinner /> : props.children}
        </div>
    </div>
}
