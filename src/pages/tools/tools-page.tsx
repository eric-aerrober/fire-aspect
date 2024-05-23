import { useNavigate } from "react-router-dom";
import { CenterPage } from "../../components/layout/Center";
import { LabeledSection } from "../../components/layout/LabeledSection";
import { PageScafold } from "../../components/layout/PageScafold";
import { useListenTableItems } from "../../database/hooks";
import { ToolDefinedTableElement } from "../../database/apis/tools_table";
import { ToolIntegrationDefinitions } from "../../orchestration/tools/ToolIntegrationOptions";
import { TableElm } from "../../components/tables/Table";
import { DB } from "../../database/database";


export function ToolsPage () {
    
    const nav = useNavigate();
    const currentTools = useListenTableItems<ToolDefinedTableElement>('tools');
    const toolOptions = Object.values(ToolIntegrationDefinitions);

    if (!currentTools) return <div>Loading...</div>

    return <CenterPage width="1000px">
        <PageScafold title="Tool Integrations">
            <TableElm
                title="Active Tool Integrations"
                rows={currentTools}
                columns={['name', 'toolType']}
                onClick={(row) => nav(`/database/tools/${row.id}`)}
                onDelete={(row) => DB.tools.delete(row.id)}
            />
            <br/>
            <br/>
            <LabeledSection title="Define New Tools">
                {
                    Object.keys(toolOptions).map((key) => {
                        const tool = toolOptions[key as any];
                        return <div className="my-2 p-3 border rounded hover:bg-gray-100 cursor-pointer flex justify-left gap-5 pl-5" onClick={() => nav(`/tools/new/${tool.id}`)}>
                            <div className="w-20 ">
                                {tool.logo}
                            </div>
                            <div className="ml-3">
                                <div className="font-bold">{tool.name}</div>
                                <div className="text-sm">{tool.description}</div>
                            </div>
                        </div>
                    })
                }
            </LabeledSection>
        </PageScafold>
    </CenterPage>
}