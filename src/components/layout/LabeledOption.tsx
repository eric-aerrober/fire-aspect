import { ReactNode } from "react";

export interface LabeledOptionInteface {
    label: string,
    children: ReactNode,
}

export function LabeldOption (props: LabeledOptionInteface) {
    
    return <div className="w-full my-2 flex flex-row justify-between">
        <h1 className="text-lg capitalize pt-1">{props.label}</h1>
        <div className="">
            {props.children}
        </div>
    </div>

}