import { useNavigate } from "react-router-dom"

export function Link ({ small, href, children }: { href: string, children: React.ReactNode, small?: boolean }) {
    const nav = useNavigate()
    return <div 
        className={`text-indigo-500 hover:underline ${small ? 'text-sm' : ''} cursor-pointer`}
        style={{display: 'inline-block'}}
        onMouseDown={(e) => {
            nav(href)
            e.preventDefault()
        }}
    >
        {children}
    </div>
}

export function LinkToId (ref: string) {
    const [table, id] = ref.split('::')
    return <Link href={`/database/${table}/${ref}`}>{table}:{id?.substring(0,5)}</Link>
}