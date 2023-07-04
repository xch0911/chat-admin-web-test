
export interface AnswerParams {
  conversation: ChatRecord[];
  maxTokens?: number;
  signal?: AbortSignal;
}
