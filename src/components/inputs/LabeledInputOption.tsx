import { TextInput } from "@tremor/react";
import { LabeldOption } from "../layout/LabeledOption";

export interface LabeldInputOptionProps {
    label: string;
    readonly?: boolean;
    value: string;
    onValueChange: (val: string) => void;
    placeholder?: string;
    width?: string;
}

export function LabeldInputOption({label, readonly, value, onValueChange, placeholder, width}: LabeldInputOptionProps) {
    return <LabeldOption label={label}>
        <TextInput
            className={`mb-2 ${readonly ? 'bg-gray-200' : ''} w-[600px]`}
            placeholder={placeholder} 
            readOnly={readonly}
            value={value} 
            onValueChange={onValueChange}
        />
    </LabeldOption>
}