import { Outlet } from "react-router"
import { UnPadContent } from "../layout/UnPadContent"
import { ReactNode } from "react"

export interface LabeledSidebarParams  {
    children: ReactNode
    outlet?: ReactNode
}

export function LabeledSidebar (props: LabeledSidebarParams) {

    return <>
        <UnPadContent>
            <div className="flex flex-row w-full">
                <div className="h-[100vh] w-[300px] bg-gray-50 border-r-2 border-gray-200 overflow-y-hidden">
                    {props.children}
                </div>
                <div className="flex-1 p-4 overflow-y-scroll h-[100vh] relative">
                    {props.outlet ? props.outlet : <Outlet />}
                </div>
            </div>
        </UnPadContent>
    </>
}