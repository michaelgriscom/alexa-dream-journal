import {
    HandlerInput,
    RequestHandler
} from 'ask-sdk-core';
import {
    Response, IntentRequest
} from 'ask-sdk-model';
import { IJournal } from './IJournal';

const responseText = 'Dream recorded.';
const intentName = 'CreateEntryIntent';

export class CreateEntryIntentHandler implements RequestHandler {
    private journal: IJournal;
    public constructor(
        journal: IJournal) {
        this.journal = journal;
    }

    canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === intentName;
    }

    handle(handlerInput: HandlerInput): Response | Promise<Response> {
        const speechText = responseText;
        const accessToken = handlerInput.requestEnvelope.session
            && handlerInput.requestEnvelope.session.user.accessToken;

        const contents = (handlerInput.requestEnvelope.request as IntentRequest)
            .intent.slots.contents.value;
        return this.journal.createEntry(contents, accessToken).then(() =>
             handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(speechText, speechText)
            .getResponse()
        );
    }
}