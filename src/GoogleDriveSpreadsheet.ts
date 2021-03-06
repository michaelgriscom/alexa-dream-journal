import { google, drive_v3, sheets_v4 } from 'googleapis';
import { IJournal } from './IJournal';
import { OAuth2Client } from 'google-auth-library';

export class GoogleDriveSpreadsheet implements IJournal {
    private static readonly spreadsheetName: string = "alexa-dream-assistant";
    private static readonly journalSheetName: string = "journal";

    private sheets: sheets_v4.Sheets;
    private drive: drive_v3.Drive;
    private oauth2Client: OAuth2Client;

    public constructor() {
        this.oauth2Client = new google.auth.OAuth2();
        this.sheets = google.sheets({
            version: 'v4',
            auth: this.oauth2Client
        });
        this.drive = google.drive({
            version: 'v3',
            auth: this.oauth2Client
        });
    }

    public async createEntry(contents: string, latestToken: string): Promise<void> {
        this.setToken(latestToken);

        const spreadsheet = await this.getOrCreateSpreadsheet();
        const entryTime: string = new Date().toLocaleString();
        const entryData = [entryTime, contents];

        await this.sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheet.spreadsheetId,
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            range: `${GoogleDriveSpreadsheet.journalSheetName}!A1:B1`,
            requestBody: {
                values: [entryData]
            }
        });
    }

    private setToken(token: string) {
        this.oauth2Client.setCredentials({ access_token: token });
    }

    private async getSpreadsheetId(): Promise<string> {
        const mimeType = "application/vnd.google-apps.spreadsheet";
        const queryParts: string[] = [`name="${GoogleDriveSpreadsheet.spreadsheetName}"`, `mimeType="${mimeType}"`];
        const queryJoin = "and";

        const getItemRes = await this.drive.files.list({
            q: queryParts.join(queryJoin)
        }, null);

        const itemId = getItemRes.data.files && getItemRes.data.files[0] && getItemRes.data.files[0].id;
        if (!itemId) {
            return null;
        }

        return itemId;
    }

    private async getSpreadsheet(): Promise<sheets_v4.Schema$Spreadsheet> {
        const spreadsheetId = await this.getSpreadsheetId();
        if (!spreadsheetId) {
            return null;
        }

        const response = await this.sheets.spreadsheets.get({
            spreadsheetId
        });

        return response.data;
    }

    private async getOrCreateSpreadsheet(): Promise<sheets_v4.Schema$Spreadsheet> {
        const existingSpreadsheet = await this.getSpreadsheet();
        if (existingSpreadsheet) {
            return existingSpreadsheet;
        }

        const response = await this.sheets.spreadsheets.create({
            requestBody: {
                properties: {
                    title: GoogleDriveSpreadsheet.spreadsheetName
                },
                sheets: [{
                        properties: {
                            title: GoogleDriveSpreadsheet.journalSheetName
                        }
                    }
                ]
            }
        });

        return response.data;
    }
}