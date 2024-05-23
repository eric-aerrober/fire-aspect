import { asc, eq } from "drizzle-orm";
import { APIWrapper } from "../api_wrapper";
import { EventsTable, EventTableElement } from "./events_table";

export class EventsAPI extends APIWrapper<EventTableElement, typeof EventsTable> {

    public async allFromConversation(conversationId: string) {
        return this.allFromParent(conversationId)
    }

    public async allFromParent(parentId: string) {
        return await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.parentId, parentId))
            .orderBy(asc(this.table.creationDate))
            .all() as EventTableElement[]
    }

    public async allFromParentsTwoLevels(nodeId: string) {
        const self = await this.get(nodeId)
        const parent = await this.get(self.parentId)
        const childrenOfParent = await this.allFromParent(self.parentId)
        const childrenOfChildren = await Promise.all(
            childrenOfParent.map(child => this.allFromParent(child.id))
        );

        return {
            self: self,
            parent: parent,
            parentId: self.parentId,
            parentEvents: childrenOfParent,
            children: childrenOfParent.map((child, index) => ({
                child: child,
                children: childrenOfChildren[index]
            }))
        }
    }

    public async addRelatedRecord(eventId: string, recordId: string) {
        const event = await this.get(eventId)
        const relatedRecords = event.relatedRecords ? event.relatedRecords.split(',') : []
        relatedRecords.push(recordId)
        return await this.update({
            id: eventId,
            relatedRecords: relatedRecords.join(',')
        })
    }

}
