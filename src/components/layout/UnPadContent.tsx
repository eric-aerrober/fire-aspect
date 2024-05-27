import { ReactNode } from "react";

export interface UnPadContentInterface {
    children: ReactNode
}

export function UnPadContent (props: UnPadContentInterface) {
    
    return <div className="-translate-x-4 -translate-y-4 h-full relative overflow-y-none" style={{
        width: 'calc(100% + 32px)',
        height: 'calc(100% + 32px)',
    }}>
        {props.children}
    </div>

}