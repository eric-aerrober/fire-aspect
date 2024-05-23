import { useState } from "react";
import { Button, TextInput } from "@tremor/react";
import { useNavigate, useParams } from "react-router-dom";
import { DB } from "../../database/database";
import { useListenItem } from "../../database/hooks";
import { PageScafold } from "../../components/layout/PageScafold";
import { CenterPage } from "../../components/layout/Center";
import { LabeledSection } from "../../components/layout/LabeledSection";
import { LabeldOption } from "../../components/layout/LabeledOption";
import { READONLY } from "./routing";
import { DeleteButton } from "../../components/inputs/Buttons";

interface DBViewItemProps<T> {
    tableName: keyof typeof DB
}

export function DBViewItem<T> ({tableName}: DBViewItemProps<T>) {

    const nav = useNavigate()
    const { id } = useParams()
    const api = DB[tableName]
    const row = useListenItem<T>(tableName, id)

    if (!id || !row) return null

    const columnNames = Object.keys(row)
        .filter(col => col !== 'id')
    const renderedColumns = ['id', ...columnNames]

    const updateItem = (key: string, value: string) => {
        api.update({
            id: id,
            [key]: value
        })
    }

    const onDelete = () => {
        api.delete(id)
        nav(`/database/${tableName}`)
    }

    return <CenterPage width="1000px">
        <PageScafold 
            title={`View entry in ${tableName}`} 
            actionsRight={<DeleteButton 
            onClick={onDelete} />}
            breadcrumbs={[
                {name: tableName + ' table', href: `/database/${tableName}`},
                {name: 'View Entry', href: `/database/${tableName}/view/${id}`}
            
            ]}
        >
            <LabeledSection title="Fields">
                {
                    renderedColumns.map((col) => <div key={col}>
                        <LabeldOption label={col}>
                            <TextInput
                                className={`mb-2 ${READONLY.indexOf(col) !== -1 ? 'bg-gray-200' : ''} w-[600px]`}
                                placeholder={col} 
                                readOnly={READONLY.indexOf(col) !== -1}
                                value={(row as any)[col] + "" || ''} 
                                onValueChange={(val) => updateItem(col, val)}
                            />
                        </LabeldOption>
                    </div>)
                }
        </LabeledSection>
    </PageScafold>
    </CenterPage>

}