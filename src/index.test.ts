import { expect } from "chai";
import * as va from "virtual-alexa";

describe("index tests", () => {
    let alexa: va.VirtualAlexa;
    beforeEach(() => {
        alexa = va.VirtualAlexa.Builder()
            .handler("index.js") // Lambda function file and name
            .interactionModelFile("./models/en-US.json")
            .create();
    });

    it("say hello", (done) => {
        alexa.utter("hello").then((result) => {
            expect((result as any).response.outputSpeech.ssml).to.exist;
            expect((result as any).response.outputSpeech.ssml).to.include("Hello World");
            done();
        });
    });

})