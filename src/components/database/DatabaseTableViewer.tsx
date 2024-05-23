import { useNavigate } from "react-router"
import { DB } from "../../database/database"
import { useListenTableItems } from "../../database/hooks"
import { LinkToId } from "../link"
import { TimeDisplay } from "../time-display"
import { CreateButton, DeleteButton } from "../inputs/Buttons"
import { TableElm } from "../tables/Table"
import { PageScafold } from "../layout/PageScafold"

export interface DatabaseTableViewerInterface {
    tableId: keyof typeof DB
}

export function DatabaseTableViewer (props: DatabaseTableViewerInterface) {

    const nav = useNavigate()
    const tableItems = useListenTableItems(props.tableId)

    if (!tableItems) return <div>Loading...</div>
    if (!tableItems.length) return (
        <PageScafold title={`${props.tableId} Data Table`}>
            No items in this table
        </PageScafold>
    )

    const columnNames = Object.keys(tableItems[0] as any || {})
        .filter(col => col !== 'version' && col !== 'creationDate' && col !== 'modifiedDate' && col !== 'id')

    const renderedColumns = ['ID', ...columnNames]

    return <PageScafold title={`${props.tableId} Data Table`}>
        <TableElm
            actions={<div className="flex gap-4 pt-1">
                <DeleteButton onClick={() => DB[props.tableId].purge()} text="Purge" />
            </div>}
            title={props.tableId}
            columns={renderedColumns}
            rows={
                tableItems.map((row : any) => {
                    let data : any = {}
                    renderedColumns.forEach(col => {
                        data[col] = row[col]
                        if (row[col] && row[col].includes && row[col].includes('::')) {
                            data[col] = LinkToId(row[col])
                        }
                    })
                    data = {
                        ...data,
                        "id": row.id,
                        'ID': LinkToId(row.id),
                        'creationDate': <TimeDisplay time={row.creationDate} />,
                    }
                    return data
                })
            }
            onClick={(row) => nav(`/database/${props.tableId}/${row["id"]}`)}
        />
    </PageScafold>

}