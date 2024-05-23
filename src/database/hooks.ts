import { useEffect, useState } from "react"
import { DB } from "./database"
import { randomId } from "./utils"

interface Listeners {
    [key: string]: {
        table: ((x: any) => void)[],
        items: {
            [key: string]: ((x: any) => void)[]
        }
    }
}
const Listeners: Listeners = {}

const listenTable = (table: keyof typeof DB, callback: (x: any) => void) => {
    if (!Listeners[table]) {
        Listeners[table] = {
            table: [callback],
            items: {}
        }
    } else {
        Listeners[table].table.push(callback)
    }
}

const listenItem = (table: keyof typeof DB, id: string, callback: (x: any) => void) => {
    if (!Listeners[table]) {
        Listeners[table] = {
            table: [],
            items: {
                [id]: [callback]
            }
        }
    } else if (!Listeners[table].items[id]) {
        Listeners[table].items[id] = [callback]
    } else {
        Listeners[table].items[id].push(callback)
    }
}

export function consumeModification(table: keyof typeof DB, id: string) {
    if (Listeners[table]) {
        Listeners[table].table.forEach(callback => callback(randomId()))
        if (Listeners[table].items[id]) {
            Listeners[table].items[id].forEach(callback => callback(randomId()))
        }
    }
}

export function useListenTableItems<T>(table: keyof typeof DB) {

    const [id, setId] = useState<string>(randomId())
    const [items, setItems] = useState<T[]>()

    useEffect(() => {
        DB[table].list().then((items) => setItems(items as T[]))
        listenTable(table, setId)
    }, [id, table])

    return items
}

export function useChooseFromTableItems<T>(table: keyof typeof DB) {

    const [id, setId] = useState<string>(randomId())
    const [items, setItems] = useState<T[]>()
    const [chosen, setChosen] = useState<string>()

    useEffect(() => {
        DB[table].list().then((items) => {
            setItems(items as T[])
            setChosen(items[0].id)
        })
        listenTable(table, setId)
    }, [id])

    return [items, chosen, setChosen] as [T[] | undefined, string | undefined, (x: string) => void]
}


export function useChooseMultipleFromTableItems<T>(table: keyof typeof DB) {

    const [id, setId] = useState<string>(randomId())
    const [items, setItems] = useState<T[]>()
    const [chosen, setChosen] = useState<string[]>()

    useEffect(() => {
        DB[table].list().then((items) => {
            setItems(items as T[])
            setChosen([])
        })
        listenTable(table, setId)
    }, [id])

    return [items, chosen, setChosen] as [T[] | undefined, string[], (x: string[]) => void]
}

export function useListenItem<T>(table: keyof typeof DB, itemId?: string) : T | undefined {

    const [id, setId] = useState<string>(randomId())
    const [item, setItem] = useState<T>()

    useEffect(() => {
        if (!itemId) return
        DB[table].get(itemId).then((items) => setItem(items as any))
        listenItem(table, itemId, setId)
    }, [id, itemId])

    return item 
}

export function useListenQuery<V>(table: keyof typeof DB, query: (db: typeof DB) => Promise<V>, state: any[]) {

    const [id, setId] = useState<string>(randomId())
    const [value, setValue] = useState<V | null>(null)

    useEffect(() => {
        query(DB).then((value) => setValue(value))
        listenTable(table, setId)
    }, [id, ...state])

    return value
}
