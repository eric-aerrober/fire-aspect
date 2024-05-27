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
            <div className="w-full">
                <div className="h-[100vh] w-[300px] bg-gray-50 border-r-2 border-gray-200 overflow-y-auto">
                    {props.children}
                </div>
                <div className="absolute p-4 h-[100vh] w-[calc(100%-300px)] top-0 left-[300px]">
                    {props.outlet ? props.outlet : <Outlet />}
                </div>
            </div>
        </UnPadContent>
    </>
}