import { useNavigate } from "react-router";

export interface LabeledSidebarInterface {
    icon: any,
    label: string,
    path: string
}

export function LabeledSidebarOption(props: LabeledSidebarInterface) {
    const active = window.location.pathname.startsWith(props.path);
    const navigate = useNavigate();
    return <>
        <div
            className={`flex items-center space-x-4 p-2 m-2 cursor-pointer rounded ${active ? "bg-black text-white" : "hover:bg-gray-200"} capitalize`}
            onClick={() => navigate(props.path)}
        >
            <div className="w-5">
                <props.icon size={25} />
            </div>
            <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                {props.label}
            </div>
        </div>
    </>
}
