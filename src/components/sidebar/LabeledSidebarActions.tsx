import { ReactNode } from "react";
import { useNavigate } from "react-router";

export interface LabeledSidebarActionsInterface {
    label: string,
    actions?: ReactNode
}

export function LabeledSidebarActions(props: LabeledSidebarActionsInterface) {
    return <div className="w-full p-4 flex flex-row justify-between text-gray-500 border-b items-center">
        <h1 className="text-lg">{props.label}</h1>
        {props.actions}
    </div>

}
