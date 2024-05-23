import { APIWrapper } from "../api_wrapper";
import { SettingsTable, SettingsTableElement } from "./settings_table";

export class SettingsApi extends APIWrapper<SettingsTableElement, typeof SettingsTable> {

    public async getSettings() {
        return (await this.list())[0];
    }

    public async updateSettings(settings: Partial<SettingsTableElement>) {
        const exists = await this.getSettings();
        if (exists) {
            return this.update({
                ...exists,
                ...settings as any
            });
        } else {
            return this.create({
                id: 'settings',
                ...settings as any
            })
        }
    }

}
