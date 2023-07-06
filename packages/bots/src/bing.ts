import { AbstractBot } from "./abstract-bot";
import { AnswerParams, BingEvent, BingEventType, BingPayload } from "./types";
import { streamToLineIterator } from "./utils";

const REQUEST_URL = "https://test.arfgc.com/ai/newbing";

export class BingBot extends AbstractBot {
    constructor(private cookie: string) {
        super();
    }

    protected async *doAnswer({conversation, signal}: AnswerParams,): AsyncIterable<string> {
        const userMessage = conversation.at(-1);
        if (!userMessage) {
            throw new Error("User message not found");
        }
        const response = await fetch(REQUEST_URL + "?q=" + userMessage.content, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`${response.statusText}: ${await response.text()}`);
        }
        for await (const line of streamToLineIterator(response.body!)) {
            yield line
        }
    }
}
