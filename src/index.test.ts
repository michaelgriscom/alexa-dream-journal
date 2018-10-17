import { expect } from "chai";
import * as va from "virtual-alexa";
import * as journal from "./IJournal";
import * as sinon from "sinon";
import {createHandler} from "./index";

describe("index tests", () => {
    let alexa: va.VirtualAlexa;
    let journalStub: sinon.SinonStubbedInstance<journal.IJournal>;
    const accessToken = "accessToken";

    beforeEach(() => {
        journalStub = sinon.createStubInstance(journal.SpreadsheetJournal);
        // per https://github.com/bespoken/virtual-alexa/issues/66 virtual-alexa doesn't currently support
        // the pipe annotation which is required for AMAZON.LITERAL, so instead of loading the model
        // we'll just imperatively use 'intend' to invoke intentions
        alexa = va.VirtualAlexa.Builder()
            .handler(createHandler(journalStub))
            .create();
        alexa.context().accessToken = () => accessToken;
    });

    it("create new journal entry", (done) => {
        const contents = "these are the contents of the dream";
        journalStub.createEntry.returns(Promise.resolve());
        alexa.intend("CreateEntryIntent", { "contents": contents }).then((result) => {
            expect((result as any).response.outputSpeech.ssml).to.exist;
            expect((result as any).response.outputSpeech.ssml).to.include("Dream recorded");
            expect(journalStub.createEntry.calledOnce).to.be.true;
            expect(journalStub.createEntry.getCall(0).args[0]).to.equal(contents);
            expect(journalStub.createEntry.getCall(0).args[1]).to.equal(accessToken);

            done();
        });
    });

})