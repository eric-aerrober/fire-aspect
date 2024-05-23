import { ReactNode } from "react";

export interface LabeledSectionInterface {
    title: string,
    children: ReactNode,
}

export function LabeledSection (props: LabeledSectionInterface) {
    
    return <div className="w-full my-4">
        <h1 className="text-2xl">{props.title}</h1>
        <br/>
        {props.children}
    </div>

}