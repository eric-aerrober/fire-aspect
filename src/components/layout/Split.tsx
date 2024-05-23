import { ReactNode } from "react";
import { UnPadContent } from "./UnPadContent";

export interface SplitPageProps {
    left: ReactNode
    right?: ReactNode
}

export function SplitPage(props: SplitPageProps) {
    return <UnPadContent>
        <div className="flex h-full">
            <div style={{flex: 2}} className="p-4 overflow-y-auto pb-52">
                {props.left}
            </div>
            {
                props.right && <div style={{flex: 1}} className="ml-4 border-l-2 border-gray-200 p-4 pl-8 bg-gray-50">
                    {props.right}
                </div>
            }
        </div>
    </UnPadContent>
}
