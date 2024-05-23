import { useParams } from "react-router-dom";
import { useListenItem, useListenQuery } from "../../database/hooks";
import { CenterPage } from "../../components/layout/Center";
import { PageScafold } from "../../components/layout/PageScafold";
import { DB } from "../../database/database";
import { EventTableElement, EventType } from "../../database/apis/events_table";
import { ChatModelInvoke } from "./side-panel-views/chat-model-invoke";
import fs from 'fs'

export function ExecutionLogSidePanel () {

    const {id} = useParams()
    const event = useListenItem<EventTableElement>('events', id || '')

    if (!id) return 'invalid id'
    if (!event) return 'loading'

    if (event.type === EventType.CHAT_MODEL_RESPOND_MESSAGE && event.relatedRecords ) {
        return <CenterPage>
            <PageScafold title="Chat model was Invoked">
                <ChatModelInvoke event={event} />
            </PageScafold>
        </CenterPage>
    }

    if (event.type === EventType.TOOL_INVOKE) {

        const request = fs.readFileSync(event.content + '/input.json').toString()
        const result = fs.readFileSync(event.content + '/result.json').toString()

        return <CenterPage>
            <PageScafold title="Tool was Invoked">
                Tool Request Parameters:
                <code>
                    <pre>
                        {JSON.stringify(JSON.parse(request), null, 4)}
                    </pre>
                </code>
                <br />
                Tool Response Parameters:
                <code>
                    <pre>
                        {JSON.stringify(JSON.parse(result), null, 4)}
                    </pre>
                </code>
            </PageScafold>
        </CenterPage>
    }

    return <CenterPage>
        <PageScafold title="">
            <div className="text-gray-500">
                no additional information for this event
            </div>
        </PageScafold>
    </CenterPage>

}


