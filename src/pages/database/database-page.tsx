import { LabeledSidebar } from "../../components/sidebar/LabeledSidebar";
import { LabeledSidebarOption } from "../../components/sidebar/LabeledSidebarOption";
import Database from 'remixicon-react/Database2LineIcon'
import { LabeledSidebarSection } from "../../components/sidebar/LabeledSidebarSection";
import { DB } from "../../database/database";

export function DataBasePage () {
    
    const tableNames = Object.keys(DB);

    return <LabeledSidebar>
        <LabeledSidebarSection label="Local Tables" />
        {
            tableNames.map((tableName, index) => {
                return <LabeledSidebarOption
                    key={index}
                    icon={Database}
                    label={tableName}
                    path={`/database/${tableName}`}
                />
            })
        }
    </LabeledSidebar>
}