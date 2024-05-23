import { ReactNode } from "react";

export interface SectionCard {
    title: string;
    actions?: ReactNode;
    children: ReactNode
    noPadding?: boolean;
}

export function Card ({title, children, actions, noPadding}: SectionCard) {

    return (
        <div className="mb-4 rounded">
            <div className="flex flex-row justify-between border rounded-t border-gray-200 p-3">
                <div className="text-lg capitalize">
                    {title}
                </div>
                <div>
                    {actions}
                </div>
            </div>
            <div className={`${noPadding ? '' : 'p-2'}`}>
                {children}
            </div>
        </div>
    )
} 