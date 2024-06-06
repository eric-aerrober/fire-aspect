import { DB } from "../../database/database";

export class PromptStore {

    constructor (
        private readonly prefix: string
    ) {}

    async loadPrompt (id: string, obj: any = {}) {
        return this.compilePrompt(`${this.prefix}-${id}`, obj);
    }

    private async compilePrompt (promptId: string, obj: any) {

        const keys = Object.keys(obj);
        const fullPrompt = await DB.prompts.get(promptId);
    
        if (!fullPrompt) {
            throw new Error('Prompt not found: ' + promptId);
        }
    
        let prompt = fullPrompt.content;
    
        for (const key of keys) {
            prompt = prompt.replace(`{{${key}}}`, obj[key]);
        }
    
        return prompt;
    }

}