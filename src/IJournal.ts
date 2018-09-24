import { google } from 'googleapis';

export abstract class IJournal {
    abstract async createEntry(contents: string, accessToken: string): Promise<void>;
}

export class ConsoleJournal implements IJournal {
    async createEntry(entry: string, accessToken: string): Promise<void> {
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });
        const drive = google.drive({
            version: 'v3',
            auth: oauth2Client
        });
        const res = await drive.files.create({
            requestBody: {
                name: 'DreamSkill',
                mimeType: 'text/plain'
            },
            media: {
                mediaType: 'text/plain',
                body: entry
            }
        }, null);

        console.log("creating entry" + entry);
        console.log("drive response", res);
    }
}

export function createJournal(): IJournal {
    console.log("creating journal");
    return new ConsoleJournal();
}