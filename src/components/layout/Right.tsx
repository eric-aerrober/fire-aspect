export interface RightProps {
    children: React.ReactNode;
}

export function Right({children}: RightProps) {
    return <div className="w-full flex justify-end gap-4">
        {children}
    </div>
}