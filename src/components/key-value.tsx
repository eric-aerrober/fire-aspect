import { ReactNode } from "react";
import { Card } from "./layout/Card";

export interface KeyValueComponentProps {
    label: string;
    value: ReactNode;
}

export function KeyValueComponent (props: KeyValueComponentProps) {
    return <div className="min-w-52">
        <div className="text-left pr-2 p-1 text-gray-400 text-sm capitalize" style={{flex: 1}}>{props.label}</div>
        <div className="text-left pl-2 p-1" style={{flex: 4}}>{props.value === null ? '-' : props.value}</div>
    </div>
}

export interface RenderObject {
    title?: string;
    object: {
        [key: string]: ReactNode
    }
}

export function KeyValueObject (props: RenderObject) {
    return <>
        <div className="flex flex-row gap-12 flex-wrap">
        {
            Object.keys(props.object).map((key) => {
                return <KeyValueComponent key={key} label={key} value={props.object[key]} />
            })
        }
        </div>
    </>
}

export function KeyValueCard (props: RenderObject) {
    return <>
        <Card title={props.title}>
            <KeyValueObject {...props} />
        </Card>
    </>
}

export function Label (props: {label: string, actions?: ReactNode}) {
    return (
        <div className="flex flex-row justify-between pt-3 pb-1 ">
            <div className="text-left text-sm text-gray-500" style={{flex: 1}}>{props.label}</div>
            <div className="text-right text-sm">
                {props.actions}
            </div>
        </div>
    )
}