import { APIWrapper } from "../api_wrapper";
import { DB } from "../database";
import { ConversationTable, ConversationTableElement } from "./conversation_table";
import { EventTableElement } from "./events_table";

export class ConversationAPI extends APIWrapper<ConversationTableElement, typeof ConversationTable> {

    public async blockOnEvent (event: EventTableElement) {
        return this.update({
            id: event.parentId,
            blockingEventId: event.id
        })
    }

    public async unblockOnEvent (event: EventTableElement) {
        return this.update({
            id: event.parentId,
            blockingEventId: ''
        })
    }

}


