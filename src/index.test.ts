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
        journalStub = sinon.createStubInstance(journal.ConsoleJournal);
        alexa = va.VirtualAlexa.Builder()
            .handler(createHandler(journalStub))
            .interactionModelFile("./models/en-US.json")
            .create();
        alexa.context().accessToken = () => accessToken;
    });

    it("create new journal entry", (done) => {
        const contents = "these are the contents of the dream";
        journalStub.createEntry.returns(Promise.resolve());
        alexa.utter(`I had a dream about ${contents}`).then((result) => {
            expect((result as any).response.outputSpeech.ssml).to.exist;
            expect((result as any).response.outputSpeech.ssml).to.include("Dream recorded");
            expect(journalStub.createEntry.calledOnce).to.be.true;
            expect(journalStub.createEntry.getCall(0).args[0]).to.equal(contents);
            expect(journalStub.createEntry.getCall(0).args[1]).to.equal(accessToken);

            done();
        });
    });

})