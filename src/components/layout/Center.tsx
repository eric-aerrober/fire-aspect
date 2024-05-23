import { ReactNode } from "react";

export interface CenterPageProps {
    width?: string
    children: ReactNode
}

export function CenterPage(props: CenterPageProps) {
    return <div style={{ width: props.width || "800px" }} className="mx-auto">
        {props.children}
    </div>
}


export interface CenterProps {
    children: ReactNode
}

export function Center(props: CenterPageProps) {
    return <div className="absolute inset-0 flex items-center justify-center">
        {props.children}
    </div>
}