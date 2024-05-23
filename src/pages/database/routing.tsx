import { useNavigate, useParams } from "react-router-dom";
import { DatabaseTableViewer } from "../../components/database/DatabaseTableViewer";
import { DB } from "../../database/database"
import { DBViewItem } from "./view-item";

export const READONLY = ['id', 'creationDate', 'modifiedDate', 'version']


export function buildDatabaseTableRouter () {

    const tables = Object.keys(DB) as (keyof typeof DB)[];
    const routes = [] as any[]

    tables.forEach(table => {
        routes.push(
            {
                path: `/database/${table}`,
                element: <DatabaseTableViewer tableId={table} />
            },
            {
                path: `/database/${table}/:id`,
                element: <DBViewItem tableName={table} />,
            },
        )
    })
    return routes

}