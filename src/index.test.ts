import * as va from "virtual-alexa";

describe("index tests", () => {
    const alexa: va.VirtualAlexa = va.VirtualAlexa.Builder()
        .handler("index.handler") // Lambda function file and name
        .interactionModelFile("./models/en-US.json") // Path to interaction model file
        .create();

    it("say hello", () => {
        alexa.utter("hello").then((payload) => {
            console.log("OutputSpeech: " + (payload as any).response.outputSpeech.ssml);
            // Prints out returned SSML, e.g., "<speak> Welcome to my Skill </speak>"
        });
    });

})