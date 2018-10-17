import { GoogleDriveSpreadsheet } from './GoogleDriveSpreadsheet';

export abstract class IJournal {
    abstract async createEntry(contents: string, accessToken: string): Promise<void>;
}

export function createJournal(): IJournal {
    console.log("creating journal");
    return new GoogleDriveSpreadsheet();
}