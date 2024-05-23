import { Textarea } from "@tremor/react"
import { useState } from "react"

export interface InputBoxProps {
    onSend: (message: string) => void
    className?: string
    disabled?: boolean
}

export function InputBox (props: InputBoxProps) {

    const [inputString, setInputString] = useState('')
    const [holdingShift, setHoldingShift] = useState(false)

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (props.disabled) return
        if (e.key === 'Shift') {
            setHoldingShift(true)
        }
        if (e.key === 'Enter' && holdingShift) {
            setInputString(inputString + '\n')
        }
        if (e.key === 'Enter' && !holdingShift) {
            e.preventDefault()
            if (inputString.trim() === '') return
            props.onSend(inputString)
            setInputString('')
        }
    }

    const onKeyUp = (e: React.KeyboardEvent) => {
        if (e.key === 'Shift') {
            setHoldingShift(false)
        }
    }

    return (
        <Textarea className="h-40"
            placeholder="Type a message here . . ."
            value={inputString} 
            onValueChange={setInputString} 
            onKeyDown={onKeyDown} 
            onKeyUp={onKeyUp} 
            disabled={props.disabled} />
    )

}