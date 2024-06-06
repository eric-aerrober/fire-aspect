import { EventTableElement, EventType } from "../../database/apis/events_table"
import { DB } from "../../database/database"
import { Status } from "../../database/enums"
import { randomId, shortRandomId } from "../../database/utils"
import { ModelIntegrations } from "../models/IntegrationBuilder"
import { ToolIntegrations } from "../tools/ToolIntegration"
import { deepCopy } from "../utils/objects"
import { ExecutionNode } from "./ExecutionNode"
import { ExecutionVariable } from "./ExecutionVariable"

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
    contextVariables: Record<string, ExecutionVariable>
}

export class ExecutionContext<StoredState> {

    // What models this context can call
    public readonly integrations: ModelIntegrations

    // What tools are known by this context
    public readonly tools: ToolIntegrations

    // The root event of this context, what created it
    public rootEvent: EventTableElement

    // Conversation history, what has been said so far
    private conversationHistory: ConversationHistoryMessage[];

    // The state of the context, merged into from all events here
    private storedState: StoredState;

    // Variables known to this context
    private contextVariables: Record<string, ExecutionVariable> = {}

    constructor (props: ExecutionContextProps<StoredState>) {
        this.integrations = props.integrations
        this.rootEvent = props.rootEvent
        this.conversationHistory = props.conversationHistory
        this.storedState = props.storedState
        this.tools = props.tools
        this.contextVariables = props.contextVariables || {}
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

    public getLastUserMessage () {
        for (let i = this.conversationHistory.length - 1; i >= 0; i--) {
            if (this.conversationHistory[i].sender == 'user') {
                return this.conversationHistory[i]
            }
        }
        return null
    }

    public addAgentMessage (message: string) {
        return new ExecutionContext({
            integrations: this.integrations,
            rootEvent: this.rootEvent,
            conversationHistory: this.conversationHistory.concat({sender: 'agent', message}),
            storedState: this.storedState,
            tools: this.tools,
            contextVariables: this.contextVariables
        })
    }

    public clearMessages () {
        return new ExecutionContext({
            integrations: this.integrations,
            rootEvent: this.rootEvent,
            conversationHistory: [],
            storedState: this.storedState,
            tools: this.tools,
            contextVariables: this.contextVariables
        })
    }

    public addUserMessage (message: string) {
        return new ExecutionContext({
            integrations: this.integrations,
            rootEvent: this.rootEvent,
            conversationHistory: this.conversationHistory.concat({sender: 'user', message}),
            storedState: this.storedState,
            tools: this.tools,
            contextVariables: this.contextVariables
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
            tools: this.tools,
            contextVariables: this.contextVariables
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

    private generateNameForVariable (type: string): string {
        const id = 'var::' + type + '-' + shortRandomId()
        const existingNames = Object.keys(this.contextVariables)

        if (existingNames.includes(id)) {
            return this.generateNameForVariable(type)
        }
        else {
            return id
        }
    }

    public withVariables (variables: ExecutionVariable[]) {

        const newVariables : Record<string, ExecutionVariable> = {}

        for (const variable of variables) {
            newVariables[variable.name] = variable
        }

        return new ExecutionContext({
            integrations: this.integrations,
            rootEvent: this.rootEvent,
            conversationHistory: this.conversationHistory,
            storedState: this.storedState,
            tools: this.tools,
            contextVariables: {
                ...this.contextVariables,
                ...newVariables
            }
        })

    }

    public constructVariable (variable: Partial<ExecutionVariable>) {
        const name = this.generateNameForVariable(variable.type!)
        return  {
            name,
            type: variable.type!,
            description: variable.description!,
            value: variable.value
        }
    }

    public getVariable (name: string) {
        return this.contextVariables[name]
    }

    public getVariables () {
        return Object.keys(this.contextVariables)
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
            tools: this.tools,
            contextVariables: this.contextVariables
        })
    }

    public makeChildOf (parent: ExecutionContext<any>) {
        return new ExecutionContext({
            integrations: this.integrations,
            rootEvent: parent.rootEvent,
            conversationHistory: deepCopy(this.conversationHistory),
            storedState: deepCopy(this.storedState),
            tools: this.tools,
            contextVariables: this.contextVariables
        })
    }


}