import { useNavigate, useParams } from "react-router-dom";
import { CenterPage } from "../../components/layout/Center";
import { LabeledSection } from "../../components/layout/LabeledSection";
import { PageScafold } from "../../components/layout/PageScafold";
import { useListenTableItems } from "../../database/hooks";
import { ToolDefinedTableElement } from "../../database/apis/tools_table";
import { ToolIntegrationDefinitions, ToolIntegrationType } from "../../orchestration/tools/ToolIntegrationOptions";
import { TableElm } from "../../components/tables/Table";
import { DB } from "../../database/database";
import { useState } from "react";
import { integrationDefinedForModel } from "../../orchestration/models/ModelIntegrationOptions";
import { LabeldInputOption } from "../../components/inputs/LabeledInputOption";
import { Right } from "../../components/layout/Right";
import { DeleteButton, PrimaryButton, SecondaryButton } from "../../components/inputs/Buttons";

export function ToolsAddPage () {
    
    const {id} = useParams();
    const nav = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [params, setParams] = useState<any>({});
    const [arguements, setArguements] = useState<any>([
        {
            name: 'parameter-name',
            description: 'Description of parameter'
        }
    ]);
    const definedTool = ToolIntegrationDefinitions[id as ToolIntegrationType];

    if (!id || !definedTool) {
        nav('/tools')
        return <div>Invalid Integration</div>
    }

    const onClick = async () => {
        if (!name) return alert('Please fill out all fields')
        await DB.tools.create({
            name: name.replace(/ /g, '-').toLowerCase(),
            description,
            toolType: id,
            toolConfig: JSON.stringify(params),
            toolParams: JSON.stringify(arguements)
        })
        nav('/tools')
    }

    const onAddParam = () => {
        const newArgs = [...arguements]
        newArgs.push({
            name: 'parameter-name',
            description: 'Description of parameter'
        })
        setArguements(newArgs);
    }

    return <CenterPage width="1000px">
        <PageScafold 
            title={`Add Model Integration: ${definedTool.name}`}
            breadcrumbs={[
                {name: 'Tools', href: '/tools'},
                {name: 'Add Tool', href: '/tools/add'}
            ]}
        >

            Adding an integration for a tool which can be used by agents to take actions on your behalf.

            <br/>
            <br/>
            {definedTool.description}
            <br/>
            <br/>

            <LabeldInputOption
                label="Name for Tool"
                value={name}
                onValueChange={setName}
                placeholder="Name"
            />

            <LabeldInputOption
                label="Description for agent"
                value={description}
                onValueChange={setDescription}
                placeholder="Description"
            />
            {
                definedTool.params.map((param) => {
                    return <LabeldInputOption
                        key={param.name}
                        label={param.description}
                        value={params[param.name] || ''}
                        onValueChange={(v) => setParams({...params, [param.name]: v})}
                        placeholder={"Value"}
                    />
                })
            
            }
            <br/>

            Additionally, define arguments which the tool will be called with. These are values set by the agent when calling the tool.

            <br/>
            <br/>

            {
                Object.keys(arguements).map((key) => {
                    
                    return <div key={key} className="bg-gray-50 border p-3 rounded mb-6">
                        <LabeldInputOption
                            key={key+"name"}
                            label={"Name for Argument"}
                            value={arguements[key].name}
                            onValueChange={(v) => setArguements({...arguements, [key]: {...arguements[key], name: v}})}
                            placeholder={arguements[key]}
                        />
                        <LabeldInputOption
                            key={key+"description"}
                            label={"Description for Argument"}
                            value={arguements[key].description}
                            onValueChange={(v) => setArguements({...arguements, [key]: {...arguements[key], description: v}})}
                            placeholder={arguements[key]}
                        />
                        <Right>
                            <DeleteButton onClick={() => {
                                const newArgs = {...arguements};
                                delete newArgs[key];
                                setArguements(newArgs);
                            }} />
                        </Right>
                    </div>
                })
            }

            <br/>
            <br/>
            <Right>
                <SecondaryButton onClick={onAddParam} text="Add Paramter" />
                <PrimaryButton onClick={onClick} text="Add Integration" />
            </Right>
        </PageScafold>
    </CenterPage>

}