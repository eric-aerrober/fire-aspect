import { ReactNode } from "react";

export interface PageScafoldProps {
    title: string
    breadcrumbs?: {name: string, href: string}[]
    actionsRight?: ReactNode
    children: ReactNode
}

function Bredcrumbs({breadcrumbs}: {breadcrumbs: {name: string, href: string}[]}) {

    const crumbs = [] as any;

    for (let i = 0; i < breadcrumbs.length; i++) {
        if (i == breadcrumbs.length - 1) { 
            crumbs.push(breadcrumbs[i].name)
        } else {
            crumbs.push(<a key={i} href={breadcrumbs[i].href} className="text-blue-500 hover:underline capitalize">{breadcrumbs[i].name}</a>)
            crumbs.push(<span key={i + 'sep'} className="text-gray-500"> / </span>)
        }
        
    }

    return <div className="flex items-center space-x-2 gap-4">
        {crumbs}
    </div>
}

export function PageScafold(props: PageScafoldProps) {
    return <div className="flex flex-col h-full relative">
        <div className="p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl capitalize">{props.title}</h1>
                <div>{props.actionsRight}</div>
            </div>
            {
                props.breadcrumbs && <div className="py-4">
                    <Bredcrumbs breadcrumbs={props.breadcrumbs} />
                </div>
            }
        </div>
        <div className="flex-grow p-4">
            {props.children}
        </div>
    </div>
}