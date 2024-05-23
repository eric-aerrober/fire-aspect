import { useNavigate } from "react-router";

export interface IconSidebarInterface {
    icon: any,
    tooltip: string,
    path: string
}

export function IconSidebarOption(props: IconSidebarInterface) {
    const active = window.location.pathname.startsWith(props.path);
    const navigate = useNavigate();
    return <>
        <div
            className={`flex items-center space-x-4 p-3 cursor-pointer m-0 ${active ? "bg-black text-white" : "hover:bg-gray-200"}`}
            onClick={() => navigate(props.path)}
            data-tooltip-content={props.tooltip}
            data-tooltip-id="sidebar-tooltip"
            data-tooltip-place="right"
            data-tooltip-delay-show={500}
        >
            <props.icon size={35} />
        </div>
    </>
}
