import { Select, SelectItem } from "@tremor/react"
import { Label } from "../key-value"
import { ReactNode } from "react"
import { MultiSelect, MultiSelectItem } from '@tremor/react';

export interface SelectOneOf<T extends {id: string, name: string}> {
    label: string
    actions?: ReactNode
    options: {id: string, render: ReactNode}[],
    selected?: string
    onSelect: (id: string) => void
}

export function SelectOneOf<T extends {id: string, name: string}>(props: SelectOneOf<T>) {
    return <>
        <Label label={props.label} actions={props.actions} />
        <Select
            className="mb-2"
            onValueChange={props.onSelect}
            value={props.selected}
            defaultValue={props.selected}
            >
                {
                    props.options.map(option =>
                        <SelectItem key={option.id} value={option.id}>
                            {option.render}
                        </SelectItem>
                    )
                }
        </Select>
    </>
}

export interface SelectManyOf<T extends {id: string, name: string}> {
    label: string
    actions?: ReactNode
    options: T[],
    selected?: string[]
    onSelect: (selected: string[]) => void
}

export function SelectManyOf<T extends {id: string, name: string}>(props: SelectManyOf<T>) {

    return <>
        <Label label={props.label} actions={props.actions} />
        <MultiSelect
            className="mb-2"
            onValueChange={props.onSelect}
            value={props.selected}
            defaultValue={props.selected}
            placeholder="None selected"
        >
            {
                props.options.map(integration =>
                    <MultiSelectItem key={integration.id} value={integration.id} className="capitalize">
                        {integration.name}
                    </MultiSelectItem>
                )
            }
        </MultiSelect>
    </>
}