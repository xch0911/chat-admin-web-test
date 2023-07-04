import {OpenAIBot, BingBot, SparkBot } from "bots";
import {NextRequest, NextResponse} from "next/server";
import {gptModel, postPayload} from "@/app/api/bots/typing";
import {textSecurity} from "@/lib/content";
import {ModelRateLimiter} from "database";
import {LimitReason} from "@/typing.d";

import { readableStreamFromIterable } from "./lib/readable-stream-from-iterable";
import { TextEncoderStreamPonyfill } from "./lib/ponyfill";
import { AnswerParams} from "./types";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const BING_COOKIE = process.env.BING_COOKIE!;

const REQUEST_URL = "http://grab3.arfgc.com:8028/spark";

async function *doAnswer({conversation, signal}: AnswerParams,): AsyncIterable<string> {
    const userMessage = conversation.at(-1);
    if (!userMessage) {
        throw new Error("User message not found");
    }
    console.debug(REQUEST_URL + "?q=" + userMessage.content + "&u=" + "2222");
    const response = await fetch("http://103.79.25.185:8028/spark?q=111&u=222222", {
        method: "GET",
    });
    console.debug(response.ok);

    if (!response.ok) {
        throw new Error(`${response.statusText}: ${await response.text()}`);
    }

    yield response.text();
}


function answerStream(params: AnswerParams): ReadableStream<Uint8Array> {
    console.debug(1111)
    return readableStreamFromIterable(doAnswer(params))
        .pipeThrough(new TextEncoderStreamPonyfill());
}

export async function POST(req: NextRequest,
                           {params}: { params: { model: string } }): Promise<NextResponse> {
    const email = req.headers.get("email")!;

    console.debug("[Route] [Bots]", email);
    console.debug( params.model);

    let payload;

    try {
        payload = await new NextResponse(req.body).json();
    } catch {
        return NextResponse
.
    json({error: "invalid JSON"}, {status: 400}); // TODO correct code
}

    const parseResult = postPayload.safeParse(payload);

    if (!parseResult.success) return NextResponse.json(parseResult.error);

    const {conversation, maxTokens, model} = parseResult.data;

    let bot;

    switch (params.model) {
        case "openai":
            const validatedModel = gptModel.parse(model);
            bot = new OpenAIBot(OPENAI_API_KEY, validatedModel);
            break;
        case "newbing":
            bot = new BingBot(BING_COOKIE);
            break;
        case "spark":
            bot = new SparkBot(email);
            break;
        default:
            return NextResponse.json(
                {msg: "unable to find model"},
                {status: 404}
            );
    }

    const rateLimit = await ModelRateLimiter.of({email, model});

    if (rateLimit) {
        const {success, remaining} = await rateLimit.limitEmail();
        if (!success)
            return NextResponse.json({code: LimitReason.TooMany}, {status: 429});
    } else {
        console.debug("[RateLimit] 尚未设置 Free 计划的限制");
    }

    // 文本安全 TODO 节流
    if (!(await textSecurity(conversation)))
        return NextResponse.json(
            {code: LimitReason.TextNotSafe, msg: "Contains sensitive keywords."},
            {status: 402}
        );

    return new NextResponse(
        answerStream({conversation, signal: req.signal})
    );

}

export const runtime = "edge";
