import {AbstractBot} from "./abstract-bot";
import {AnswerParams} from "./types";
const REQUEST_URL = "http://103.79.25.185:8028/spark";

export class SparkBot extends AbstractBot {
    constructor(private email: string) {
        super();
    }

    protected async *doAnswer({conversation, signal}: AnswerParams,): AsyncIterable<string> {
        const userMessage = conversation.at(-1);
        if (!userMessage) {
            throw new Error("User message not found");
        }
        console.debug(REQUEST_URL + "?q=" + userMessage.content + "&u=" + this.email);
        const response = await fetch("https://test.arfgc.com", {
            method: "GET",
        });
        console.debug(response);

        if (!response.ok) {
            throw new Error(`${response.statusText}: ${await response.text()}`);
        }

        yield "12345";
    }
}
