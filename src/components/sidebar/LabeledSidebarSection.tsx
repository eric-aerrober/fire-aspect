import { ReactNode } from "react";
import { useNavigate } from "react-router";

export interface LabeledSidebarInterface {
    label: string,
    actions?: ReactNode
}

export function LabeledSidebarSection(props: LabeledSidebarInterface) {
    return <div className="w-full my-2 px-3 mt-4 flex flex-row justify-between text-gray-500">
        <h1 className="text-lg">{props.label}</h1>
        {props.actions}
    </div>

}
