import { GoogleDriveSpreadsheet } from './GoogleDriveSpreadsheet';

export abstract class IJournal {
    abstract async createEntry(contents: string, accessToken: string): Promise<void>;
}

export class SpreadsheetJournal implements IJournal {
    async createEntry(entry: string, accessToken: string): Promise<void> {
        const spreadSheet = new GoogleDriveSpreadsheet(accessToken);
        await spreadSheet.createEntry(entry);
    }
}

export function createJournal(): IJournal {
    console.log("creating journal");
    return new SpreadsheetJournal();
}