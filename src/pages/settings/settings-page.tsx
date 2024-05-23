import { LabeldInputOption } from "../../components/inputs/LabeledInputOption";
import { CenterPage } from "../../components/layout/Center";
import { LabeledSection } from "../../components/layout/LabeledSection";
import { PageScafold } from "../../components/layout/PageScafold";
import { SettingsTableElement } from "../../database/apis/settings_table";
import { DB } from "../../database/database";
import { useListenQuery } from "../../database/hooks";

export function SettingsPage () {
    
    const settings = useListenQuery<SettingsTableElement>('settings', () => DB.settings.getSettings(), [])

    return <CenterPage width="1200px">
        <PageScafold title="Singularity Settings">
            <LabeledSection title="Execution">
                <LabeldInputOption
                    label="Execution Workspace Path"
                    value={settings?.executionWorkspace || 'none'}
                    onValueChange={(v) => DB.settings.updateSettings({executionWorkspace: v})}
                />
            </LabeledSection>
        </PageScafold>
    </CenterPage>
}