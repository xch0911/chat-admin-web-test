import {AbstractBot} from "./abstract-bot";
import {AnswerParams} from "./types";
const REQUEST_URL = "https://test.arfgc.com/ai/spark";
import { streamToLineIterator } from "./utils";

export class SparkBot extends AbstractBot {
    constructor(private email: string) {
        super();
    }

    protected async *doAnswer({conversation, signal}: AnswerParams,): AsyncIterable<string> {
        const response = await fetch(REQUEST_URL + "?q=" + JSON.stringify(conversation) + "&u=" + this.email, {
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
