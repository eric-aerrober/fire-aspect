import { ReactNode } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Home from 'remixicon-react/HomeLineIcon'
import Chat from 'remixicon-react/Chat1LineIcon'
import History from 'remixicon-react/HistoryLineIcon'
import Tool from 'remixicon-react/ToolsLineIcon'
import Task from 'remixicon-react/TaskLineIcon'
import { ExchangeIcon, FileSettingsIcon, RobotIcon, SparkleIcon } from "./icons";



function SidebarOption({ icon, title, path }: { icon: ReactNode, title: string, path: string }) {
    const active = window.location.pathname.startsWith(path);
    const navigate = useNavigate();
    return (
        <div 
            className={`flex items-center space-x-4 p-2 rounded cursor-pointer m-2 ${active ? "bg-black text-white" : "hover:bg-gray-200"}`}
            onClick={() => navigate(path)}
        >
            {icon}
            <p>{title}</p>
        </div>
    )
}

export function SideBar () {

    return <div className="flex flex-row w-full">
        <div className="h-[100vh] w-[200px] bg-gray-100 border-r-2 border-gray-200 overflow-y-hidden">
            <SidebarOption icon={<Home/>} title="Home" path="/home" />
            <SidebarOption icon={<SparkleIcon/>} title="AI Models" path="/models" />
            <SidebarOption icon={<FileSettingsIcon/>} title="Prompts" path="/prompts" />
            <SidebarOption icon={<Tool/>} title="Tools" path="/tools" />
            <SidebarOption icon={<RobotIcon/>} title="Agents" path="/agents" />
            <SidebarOption icon={<Chat/>} title="Conversations" path="/conversations" />
            <SidebarOption icon={<Task/>} title="Tasks" path="/tasks" />
            <SidebarOption icon={<ExchangeIcon/>} title="Events" path="/events" />
            <SidebarOption icon={<History/>} title="Request History" path="/requests" />
        </div>
        <div className="flex-1 p-4 overflow-y-scroll h-[100vh]">
            <Outlet />
        </div>
    </div>
}