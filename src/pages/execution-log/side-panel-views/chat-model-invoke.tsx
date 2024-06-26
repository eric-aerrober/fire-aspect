import { EventTableElement } from "../../../database/apis/events_table";
import { ModelInvokeTableElement } from "../../../database/apis/model_invoke_table";
import { useListenItem } from "../../../database/hooks";
import { ConversationHistoryMessage } from "../../../orchestration/executions/ExecutionContext";
import { extractObject, fixFormatting } from "../../../orchestration/utils/strings";

export function ChatModelInvoke (props: {event: EventTableElement}) {

    const relatedRecords = props.event.relatedRecords.split(',')
    const related = useListenItem<ModelInvokeTableElement>('modelInvokes', relatedRecords[0])

    if (!related) return 'loading'

    const inputRaw = JSON.parse(related.inputRaw) as {
        messages: ConversationHistoryMessage[]
    }

    const relatedRaw = JSON.parse(related.resultRaw) as {
        message: string
    }

    const responseJson = extractObject(relatedRaw.message)

    return <div>
        {
            inputRaw.messages.map((message, i) => <div key={i} className="p-2 mb-2 bg-white border rounded ">
                <div className="text-xs text-black font-bold">{message.sender}</div>
                <div className="text-xs">
                    <pre className="text-black wrap text-wrap text-xs break-words border-none bg-white p-2">
                        {fixFormatting(message.message)}
                    </pre>
                </div>
            </div>)
        }
        <br/>
        <br/>
        Response: 
        {
            
            <div className="p-2 mt-2 bg-white text-black border rounded ">
                <div className="text-xs">
                    
                    {
                        responseJson ? <pre className="text-black wrap text-wrap text-xs break-words border-none bg-white p-2">
                            {JSON.stringify(responseJson, null, 4)}
                        </pre>
                        : relatedRaw.message
                    }
                </div>
            </div>
        }
    </div>
}