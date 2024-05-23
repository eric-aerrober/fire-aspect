import { Outlet } from "react-router"
import { IconSidebarOption } from "./IconSidebarOption"
import { Tooltip } from 'react-tooltip'

export interface IconSidebarParams  {
    options : {
        icon: any,
        tooltip: string,
        path: string
    }[]
    
}

export function IconSideBar (props: IconSidebarParams) {

    return <>
        <div className="flex flex-row w-full">
            <div className="h-[100vh] w-[55px] bg-gray-100 border-r-2 border-gray-300 overflow-y-hidden">
                {props.options.map(option => (
                    <IconSidebarOption {...option} key={option.tooltip}/>
                ))}
            </div>
            <div className="flex-1 p-4 h-[100vh]">
                <Outlet />
            </div>
        </div>
        <Tooltip id="sidebar-tooltip" />
    </>
}