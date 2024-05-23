import { useNavigate } from "react-router-dom";
import { LabeldInputOption } from "../../components/inputs/LabeledInputOption";
import { CenterPage } from "../../components/layout/Center";
import { LabeledSection } from "../../components/layout/LabeledSection";
import { PageScafold } from "../../components/layout/PageScafold";
import { SettingsTableElement } from "../../database/apis/settings_table";
import { DB } from "../../database/database";
import { useListenQuery, useListenTableItems } from "../../database/hooks";
import { AgentsTableElement } from "../../database/apis/agents_table";
import { TableElm } from "../../components/tables/Table";
import { PrimaryButton } from "../../components/inputs/Buttons";
import { Right } from "../../components/layout/Right";

export function AgentsPage () {
    
    const nav = useNavigate();
    const currentAgents = useListenTableItems<AgentsTableElement>('agents');

    if (!currentAgents) return <div>Loading...</div>

    const renderedAgents = currentAgents.map(agent => ({
        ...agent,
        tools: JSON.parse(agent.tools || '[]').length,
        subAgents: JSON.parse(agent.subAgents || '[]').length
    }))

    const onCreateNewAgent = () => {
        DB.agents.create({
            name: 'New Agent',
            tools: "[]",
            subAgents: "[]"
        }).then((id) => {
            nav(`/agents/${id.id}`)
        })
    }

    return <CenterPage width="1000px">
        <PageScafold title="Agents Defined">
            <TableElm
                title="Active Agents Integrations"
                rows={renderedAgents}
                columns={['name', 'tools', 'subAgents']}
                onClick={(row) => nav(`/agents/${row.id}`)}
                onDelete={(row) => DB.agents.delete(row.id)}
            />
            <br/>
            <Right>
                <PrimaryButton onClick={onCreateNewAgent} text="Create New Agent"/>
            </Right>
        </PageScafold>
    </CenterPage>
}