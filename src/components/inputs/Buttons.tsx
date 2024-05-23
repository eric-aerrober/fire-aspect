import { Button } from "@tremor/react";

export interface IconButton {
    icon: React.ReactNode;
    color?: string;
    className?: string;
    onClick: (e:any) => void;
    text?: string;
}

export function IconButton({ icon, onClick, className, color, text }: IconButton) {
    return <button onClick={onClick} className={`p-1 rounded hover:${color || 'bg-gray-200'} ${className} flex items-center gap-4 px-2`}>
        {icon}
        {text && <div>
            {text}
        </div>}
    </button>
}

export function DeleteButton ({ onClick, text }: { onClick: () => void, text?: string }) {
    return <Button variant='light' color='red' size="xs" onClick={e => {
        e.stopPropagation();
        onClick();
    }} children={text || 'Delete'} className="hover:bg-red-200 px-2 rounded" />
}

export function CreateButton ({ onClick, text }: { onClick: () => void, text?: string }) {
    return <Button variant='light' color='indigo' size="xs" onClick={onClick} children={text || 'Create'} />
}

export function PrimaryButton ({ onClick, text }: { onClick: () => void, text?: String }) {
    return <button onClick={onClick} className="p-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 flex items-center space-x-2">
        {text}
    </button>
}

export function SecondaryButton ({ onClick, text }: { onClick: () => void, text?: String }) {
    return <button onClick={onClick} className="p-2 rounded-md border text-black hover:bg-gray-100 flex items-center space-x-2">
        {text}
    </button>
}