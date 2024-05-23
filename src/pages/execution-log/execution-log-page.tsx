import { useOutlet } from "react-router-dom"
import { EventTableElement, EventType } from "../../database/apis/events_table"
import { useListenTableItems } from "../../database/hooks"
import { Center } from "../../components/layout/Center"
import { LabeledSidebar } from "../../components/sidebar/LabeledSidebar"
import { ReactNode, useMemo, useState } from "react"
import { LabeledSidebarOption } from "../../components/sidebar/LabeledSidebarOption"
import { LabeledSidebarSection } from "../../components/sidebar/LabeledSidebarSection"
import Chat from 'remixicon-react/Chat1LineIcon'
import { AISparklesIcon } from "../../components/logos/robot"

function NothingSelected () {
    return <Center>
        Select an event to view the execution log
    </Center>
}

interface EventMapElement {
    id: string
    parentId: string
    type: string
    status: string
    parentOnGraph?: boolean
    children: string[]
}

const getNameForType : Record<string, string> = {
    [EventType.CHAT_MODEL_RESPOND_MESSAGE]: 'Chat Model Response',
    [EventType.WORKFLOW_ROOT_EVENT]: 'AI Workflow Ran',
}

const getIconForType : Record<string, any> = {
    [EventType.CHAT_MODEL_RESPOND_MESSAGE]: Chat,
    [EventType.WORKFLOW_ROOT_EVENT]: AISparklesIcon,
}

function DetermineTopLevelEvents (events: EventTableElement[] | undefined) {

    if (!events) return { topLevelEvents: [], allEvents: [] }

    events = events.filter(event => getNameForType[event.type])

    const eventsMap : Record<string, EventMapElement> = {}

    for (const event of events) {
        eventsMap[event.id] = {
            id: event.id,
            parentId: event.parentId,
            type: event.type,
            status: event.status,
            children: []
        }
    }

    for (const event of events) {
        if (event.parentId && eventsMap[event.parentId]) {
            eventsMap[event.parentId].children.push(event.id)
            eventsMap[event.id].parentOnGraph = true
        }
        if (event.parentId && !eventsMap[event.parentId]) {
            eventsMap[event.id].parentOnGraph = false
        }
    }

    const topLevelEvents = events.filter(event => !eventsMap[event.id].parentOnGraph)
    const allEvents = events.map(event => eventsMap[event.id])

    return { topLevelEvents, allEvents }

}

export function ExecutionLogPage () {
    
    const events = useListenTableItems<EventTableElement>('events')
    const outlet = useOutlet()
    const {topLevelEvents, allEvents} = useMemo(() => DetermineTopLevelEvents(events), [events])

    if (!events) return <div>Loading...</div>

    return <LabeledSidebar outlet={!outlet && <NothingSelected />}>
        <LabeledSidebarSection label="Events" />
        {topLevelEvents.map((event, index) => 
            <LabeledSidebarOption
                key={index}
                icon={() => {
                    const Icon = getIconForType[event.type]
                    return <Icon size={24} />
                }}
                label={getNameForType[event.type]}
                path={`/execution-log/${event.id}`}
            />
        )}
    </LabeledSidebar>
}