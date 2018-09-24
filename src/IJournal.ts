export abstract class IJournal {
    abstract createEntry(contents: string) : void;
}

export class ConsoleJournal implements IJournal {
    createEntry(entry: string): void {
        console.log("creating entry" + entry);
    }
}

export function createJournal(): IJournal {
    console.log("creating journal");
    return new ConsoleJournal();
}