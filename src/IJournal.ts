export abstract class IJournal {
    abstract createEntry(contents: string) : void;
}

export class ErrorJournal implements IJournal {
    createEntry(_: string): void {
        throw new Error("Method not implemented.");
    }
}

export function createJournal(): IJournal {
    console.log("creating error journal");
    return new ErrorJournal();
}