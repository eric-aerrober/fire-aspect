import { create } from 'zustand'

interface TimeStore {
    displayMode: 'absolute' | 'relative'
    toggleDisplayMode: () => void
}

const useTimeDisplayMode = create<TimeStore>((set) => ({
    displayMode: 'relative' as 'absolute' | 'relative',
    toggleDisplayMode: () => {
        set((state) => ({
            displayMode: state.displayMode === 'absolute' ? 'relative' : 'absolute',
        }))
    }
}))

function displayTimeRelative (time: Date) {
    const now = new Date()
    const diff = now.getTime() - time.getTime()
    if (diff < 60000) {
        return 'just now'
    } else if (diff < 3600000) {
        return `${Math.floor(diff / 60000)} minutes ago`
    } else if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)} hours ago`
    } else {
        return `${Math.floor(diff / 86400000)} days ago`
    }
}

export function TimeDisplay ({ time }: { time: string }) {
    const { displayMode, toggleDisplayMode } = useTimeDisplayMode()
    return <div 
        className="cursor-alias hover:italic rounded w-fit"
        onClick={(e) => {
            e.stopPropagation()
            toggleDisplayMode()
        }}>
        {
            displayMode === 'absolute' ? time : displayTimeRelative(new Date(time as string))
        }
    </div>
}