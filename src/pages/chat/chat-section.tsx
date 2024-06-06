import { EventTableElement, EventType } from "../../database/apis/events_table";
import { Status } from "../../database/enums";
import { Spinner } from "../../components/layout/Spinner";
import Graph from 'remixicon-react/FlowChartIcon'
import { useNavigate } from "react-router-dom";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useListenQuery, useListenTableItems } from "../../database/hooks";
import { DB } from "../../database/database";

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

    const owningVariables = useListenQuery('variables', () => DB.variables.getVariablesForEvent(props.showEvent || ''), [props.showEvent]) || []

    return <div className="p-1">
        <div className="flex flex-col hover:bg-gray-50 rounded p-2">
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
        {
            owningVariables.length > 0 && <div className="flex py-2 gap-2">
                {
                    owningVariables.map((variable, index) => {
                        return <div key={index} className="flex flex-col space-y-1 p-2 bg-gray-50 border rounded hover:bg-gray-100 cursor-pointer"
                            onClick={() => nav(`/database/variables/${variable.id}`)}>
                            <div className="text-xs text-gray-500">{variable.kind}</div>
                            <div className="text-sm">{variable.description}</div>
                        </div>
                    })
                }
            </div>
        }
    </div>
}
