import { ReactNode } from "react";
import { CenterPage } from "../../components/layout/Center";
import { LabeldOption } from "../../components/layout/LabeledOption";
import { LabeledSection } from "../../components/layout/LabeledSection";
import { PageScafold } from "../../components/layout/PageScafold";
import { TableElm } from "../../components/tables/Table";
import { IntegrationTableElement } from "../../database/apis/integrations_table";
import { useListenTableItems } from "../../database/hooks";
import { useNavigate } from "react-router";
import { IntegratedModel, ModelIntegrationType, PossibleIntegrations } from "../../orchestration/models/ModelIntegrationOptions";
import { DB } from "../../database/database";

function IntegrationOption ({name, id, logo}: {name: string, id: IntegratedModel, logo: ReactNode}) {
    const nav = useNavigate();

    const onClick = () => {
        nav(`/integrations/add/${id}`)
    }

    return <div className="flex items-center space-x-4 hover:bg-gray-100 p-2 rounded-lg cursor-pointer" onClick={onClick}>
        <div className="text-lg">
            {name}
        </div>
        {logo}
    </div>
}

const labelForType = {
    [ModelIntegrationType.CONVERSATIONAL_CHAT]: 'Conversational Chat Model'
}

export function IntegrationsPage () {
    
    const nav = useNavigate();
    const currentIntegrations = useListenTableItems<IntegrationTableElement>('integrations');

    if (!currentIntegrations) return <div>Loading...</div>

    return <CenterPage width="1000px">
        <PageScafold title="Model Integrations">
            <TableElm
                title="Active Integrations"
                rows={currentIntegrations}
                columns={['name', 'integrationType', 'modelId']}
                onClick={(row) => nav(`/database/integrations/${row.id}`)}
                onDelete={(row) => DB.integrations.delete(row.id)}
            />
            <br/>
            <br/>
            <LabeledSection title="Add New Integration">
                {
                    Object.keys(PossibleIntegrations).map((key) => {

                        const label = labelForType[key as ModelIntegrationType];
                        const integrations = PossibleIntegrations[key as ModelIntegrationType];

                        return <LabeldOption label={label} key={key}>
                            <div className="space-x-4 flex flex-col items-end">
                                {
                                    integrations.map((integration) => {
                                        return <IntegrationOption {...integration} key={integration.id} />
                                    })
                                }
                            </div>
                        </LabeldOption>
                    })
                }
            </LabeledSection>
        </PageScafold>
    </CenterPage>
}