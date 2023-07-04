import {AbstractBot} from "./abstract-bot";
import {AnswerParams} from "./types";
import { streamToLineIterator } from "./utils";
import { readableStreamFromIterable } from "./lib/readable-stream-from-iterable";
import { TextEncoderStreamPonyfill } from "./lib/ponyfill";
const REQUEST_URL = "http://grab3.arfgc.com:8028/spark";

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
        const response = await fetch(REQUEST_URL + "?q=" + userMessage.content + "&u=" + this.email, {
            method: "GET",
        });
        console.debug(response);

        if (!response.ok) {
            throw new Error(`${response.statusText}: ${await response.text()}`);
        }

        yield response.text();
    }
}
