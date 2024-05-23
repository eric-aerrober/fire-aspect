import { useParams } from "react-router-dom";
import { useListenQuery } from "../../database/hooks";
import { CenterPage } from "../../components/layout/Center";
import { PageScafold } from "../../components/layout/PageScafold";
import { DB } from "../../database/database";
import { ExecutionLogEntry } from "./execution-log-entry";
import { SplitPage } from "../../components/layout/Split";
import { EventType } from "../../database/apis/events_table";
import { ExecutionLogSidePanel } from "./execution-log-side-panel";

export function ExecutionLogRendered () {

    const {id} = useParams()

    const targetEvents = useListenQuery('events', () => 
        DB.events.allFromParentsTwoLevels(id || ''), [id]);

    if (!id) return 'invalid id'
    if (!targetEvents) return 'loading'

    const myTargetEventType = targetEvents.self.type
    let viewPanel = undefined

    const mainLogView = (
        <CenterPage>
            <PageScafold title="Execution Log">
                <div className="mb-10 pb-10 border-b border-gray-200">
                    <ExecutionLogEntry
                        id={targetEvents.parentId}
                        key={targetEvents.parentId}
                        event={targetEvents.parent}
                        children={targetEvents.parentEvents}
                        topLevel={true}
                    />
                </div>
                {
                    targetEvents.children.map(event => <ExecutionLogEntry 
                        id={event.child.id}
                        key={event.child.id} 
                        event={event.child} 
                        children={event.children} 
                    />)
                }
            </PageScafold>
        </CenterPage>
    )


    return <SplitPage left={mainLogView} right={<ExecutionLogSidePanel />} />


}


