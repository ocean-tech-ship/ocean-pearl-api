export class ReadResultModel {
    public id: string;
    public reviewer: string | null;

    constructor(attributes: Partial<ReadResultModel>) {
        for (const key in attributes) {
            this[key] = attributes[key];
        }
    }
}
