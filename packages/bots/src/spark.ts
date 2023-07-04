import {AbstractBot} from "./abstract-bot";
import {AnswerParams} from "./types";

const REQUEST_URL = "http://grab3.arfgc.com:8028/spark";

export class SparkBot extends AbstractBot {
    constructor(private email: string) {
        super();
    }

    protected async * doAnswer({conversation, signal}: AnswerParams,): AsyncIterable<string> {
        // const userMessage = conversation.at(-1);
        // if (!userMessage) {
        //     throw new Error("User message not found");
        // }
        // console.log(REQUEST_URL + "?q=" + userMessage.content + "&u=" + this.email);
        // const response = await fetch(REQUEST_URL + "?q=" + userMessage.content + "&u=" + this.email, {
        //     method: "GET",
        // });
        // console.log(response);
        //
        // if (!response.ok) {
        //     throw new Error(`${response.statusText}: ${await response.text()}`);
        // }
        // return  response.text()
        return "1112233"
    }
}
