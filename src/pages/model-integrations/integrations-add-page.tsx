import { useState } from "react";
import { CenterPage } from "../../components/layout/Center";
import { PageScafold } from "../../components/layout/PageScafold";
import { useNavigate, useParams } from "react-router";
import { LabeldInputOption } from "../../components/inputs/LabeledInputOption";
import { Right } from "../../components/layout/Right";
import { PrimaryButton } from "../../components/inputs/Buttons";
import { DB } from "../../database/database";
import { IntegratedModel, integrationDefinedForModel, typeForModel } from "../../orchestration/models/ModelIntegrationOptions";

export function IntegrationsAddPage () {
    
    const {id} = useParams();
    const nav = useNavigate();
    const [name, setName] = useState('');
    const [params, setParams] = useState<any>({});
    const definedIntegration = integrationDefinedForModel(id as IntegratedModel)

    if (!id || !definedIntegration) {
        nav('/integrations')
        return <div>Invalid Integration</div>
    }

    const onClick = async () => {
        if (!name) return alert('Please fill out all fields')
        console.log('Adding integration', name, params)
        await DB.integrations.create({
            name,
            modelId: id as any,
            integrationParams: JSON.stringify(params),
            integrationType: typeForModel(id as IntegratedModel) 
        })
        nav('/integrations')
    }

    return <CenterPage width="1000px">
        <PageScafold 
            title={`Add Model Integration: ${id}`}
            breadcrumbs={[
                {name: 'Integrations', href: '/integrations'},
                {name: 'Add Integration', href: '/integrations/add'}
            ]}
        >

            Adding an integration for the model {id}, this will allow you to select this integration for actions in singularity.

            Your API key will be stored locally in the associated SQLite database, and will be used to authenticate with the service.

            <br/>
            <br/>

            <LabeldInputOption
                label="Name for Integration"
                value={name}
                onValueChange={setName}
                placeholder="Name"
            />
            {
                definedIntegration.params.map((param: string) => {
                    return <LabeldInputOption
                        key={param}
                        label={param}
                        value={params[param] || ''}
                        onValueChange={(v) => setParams({...params, [param]: v})}
                        placeholder={param}
                    />
                })
            
            }
            <Right>
                <PrimaryButton onClick={onClick} text="Add Integration" />
            </Right>
        </PageScafold>
    </CenterPage>
}