import { EventTableElement, EventType } from "../../database/apis/events_table"
import { DB } from "../../database/database"
import { Status } from "../../database/enums"
import { ModelIntegrations } from "../models/IntegrationBuilder"
import { ToolIntegrations } from "../tools/ToolIntegration"
import { deepCopy } from "../utils/objects"
import { ExecutionNode } from "./ExecutionNode"

export interface ConversationHistoryMessage {
    sender: 'agent' | 'user'
    message: string
}

export interface ExecutionContextProps<StoredState> {
    integrations: ModelIntegrations
    rootEvent: EventTableElement
    conversationHistory: ConversationHistoryMessage[]
    storedState: StoredState
    tools: ToolIntegrations
}

export class ExecutionContext<StoredState> {

    public readonly integrations: ModelIntegrations
    public readonly tools: ToolIntegrations
    public readonly rootEvent: EventTableElement
    private conversationHistory: ConversationHistoryMessage[];
    private storedState: StoredState;

    constructor (props: ExecutionContextProps<StoredState>) {
        this.integrations = props.integrations
        this.rootEvent = props.rootEvent
        this.conversationHistory = props.conversationHistory
        this.storedState = props.storedState
        this.tools = props.tools
    }

    public get state () {
        return deepCopy(this.storedState)
    }

    // Execution options

    public async runNode<ResultState> (node: ExecutionNode<StoredState, ResultState>) : Promise<ExecutionContext<ResultState>> {
        return await node.invoke(this)
    }

    // Conversation history

    public getConversationHistory () : ConversationHistoryMessage[] {
        const resultHistory = []
        for (const message of this.conversationHistory) {

            const lastIsAgent = resultHistory.length > 0 && resultHistory[resultHistory.length - 1].sender == 'agent'

            if (resultHistory.length == 0) {
                resultHistory.push(message)
            }
            else if (lastIsAgent && message.sender == 'agent') {
                resultHistory.push({sender: 'user', message: '[message blank]'} as ConversationHistoryMessage)
                resultHistory.push(message)
            }
            else if (!lastIsAgent && message.sender == 'user') {
                resultHistory.push({sender: 'agent', message: '[message blank]'} as ConversationHistoryMessage)
                resultHistory.push(message)
            }
            else {
                resultHistory.push(message)
            }
        }

        return resultHistory
    }

    public addAgentMessage (message: string) {
        return new ExecutionContext({
            integrations: this.integrations,
            rootEvent: this.rootEvent,
            conversationHistory: this.conversationHistory.concat({sender: 'agent', message}),
            storedState: this.storedState,
            tools: this.tools
        })
    }

    public addUserMessage (message: string) {
        return new ExecutionContext({
            integrations: this.integrations,
            rootEvent: this.rootEvent,
            conversationHistory: this.conversationHistory.concat({sender: 'user', message}),
            storedState: this.storedState,
            tools: this.tools
        })
    }

    // State Control

    public async recordRelatedRecord (recordId: string) {
        await DB.events.update({
            id: this.rootEvent.id,
            relatedRecords: this.rootEvent.relatedRecords + ',' + recordId
        })
    }

    public mergeState <MergeInState> (newState: MergeInState) : ExecutionContext<StoredState & MergeInState> {
        return new ExecutionContext({
            integrations: this.integrations,
            rootEvent: this.rootEvent,
            conversationHistory: this.conversationHistory,
            storedState: {...this.storedState, ...newState},
            tools: this.tools
        })
    }

    public async completeContext () {
        await DB.events.update({
            id: this.rootEvent.id,
            status: Status.SUCCESS
        })
    }

    public async failContext (message: string) {
        await DB.events.update({
            id: this.rootEvent.id,
            status: Status.ERROR,
            statusMessage: message
        })
    }

    public async referToRelatedRecord (recordId: string) {
        await DB.events.addRelatedRecord(this.rootEvent.id, recordId)
    }

    public async completeWithData (data: string) {
        await DB.events.update({
            id: this.rootEvent.id,
            status: Status.SUCCESS,
            content: data
        })
        await DB.conversations.unblockOnEvent(this.rootEvent)
    }

    public async childContext (type: EventType) {
        const newRootNode = await DB.events.create({
            parentId: this.rootEvent.id,
            type: type,
            status: Status.INPROGRESS
        })
        return new ExecutionContext({
            integrations: this.integrations,
            rootEvent: newRootNode,
            conversationHistory: deepCopy(this.conversationHistory),
            storedState: deepCopy(this.storedState),
            tools: this.tools
        })
    }


}