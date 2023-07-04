export type ChatRole = "assistant" | "user" | "system" | "context";

export type ChatRecord = {
    role: ChatRole;
    content: string;
};
export interface AnswerParams {
  conversation: ChatRecord[];
  maxTokens?: number;
  signal?: AbortSignal;
}
