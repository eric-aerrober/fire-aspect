import { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventTableElement } from "../../database/apis/events_table";
import ArrowRightIcon from 'remixicon-react/ArrowRightSLineIcon'
import ArrowLeftIcon from 'remixicon-react/ArrowLeftSLineIcon'

export interface ExecutionLogScalfoldProps {
    id: string
    timestamp: string
    children?: ReactNode
    title: string
    childEvents?: EventTableElement[]
    icon: ReactNode
    parentId?: string
    onClick?: () => void
}

export function ExecutionLogScalfold (props: ExecutionLogScalfoldProps) {

    const {id} = useParams()
    const isSelected = id === props.id
    const hasChildren = !!props.children
    const hasChildEvents = props.childEvents && props.childEvents.length > 0
    const hasParent = !!props.parentId && props.parentId.startsWith('events')
    const isClickable = !!props.onClick
    const nav = useNavigate()

    return <>
        <div className={
                `p-4 bg-white border mt-8 relative hover:bg-gray-50 hover:ring-1 ring-indigo-300 `
                + (hasChildren ? ' rounded-t-md' : ' rounded-md')
                + (isSelected ? ' border-black' : ' ')
                + (isClickable ? ' cursor-alias' : ' cursor-pointer')
            }
            onClick={props.onClick || (() => {
                nav(`/execution-log/${props.id}`)
            })}
            >
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    {props.icon}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                        {props.title}
                    </p>
                </div>
            </div>
            <div 
                onClick={(e) => {
                    e.stopPropagation()
                    nav(`/execution-log/${props.childEvents![0].id}`)
                }}
                className={
                    " absolute -right-12 top-2 text-gray-400 hover:text-white cursor-pointer hover:bg-black p-1 rounded-md border"
                    + (hasChildEvents ? '' : ' hidden')
                }>
                    <ArrowRightIcon />
            </div>
            <div 
                onClick={(e) => {
                    e.stopPropagation()
                    nav(`/execution-log/${props.id}`)
                }}
                className={
                    " absolute -left-12 top-2 text-gray-400 hover:text-white cursor-pointer hover:bg-black p-1 rounded-md border"
                    + (hasParent ? '' : ' hidden')
                }>
                    <ArrowLeftIcon />
            </div>
        </div>
        <div className={
            "p-4 bg-gray-50 border border-t-0 mt-[1px] rounded-b-md -translate-y-1 relative -z-10"
            + (hasChildren ? '' : ' hidden')
            + (isSelected ? ' border-black' : ' border-gray-300')
        }>
            {props.children}
        </div>
        <div className="flex justify-between p-1 text-sm text-gray-400">
            <div className="hover:text-gray-500 cursor-pointer hover:underline"
                onClick={() => {
                    const table = props.id.split('::')[0]
                    nav(`/database/${table}/${props.id}`)
                }}>
                {props.id}
            </div>
            {new Date(props.timestamp).toLocaleString()}
        </div>
        
    
    </>
}