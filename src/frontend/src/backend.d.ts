import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    id: MessageId;
    content: string;
    tempUserId: TempUserId;
    timestamp: bigint;
    reply?: string;
}
export type TempUserId = string;
export type MessageId = bigint;
export interface backendInterface {
    getAllMessages(): Promise<Array<Message>>;
    getCredentials(): Promise<Array<string>>;
    replyToMessage(messageId: MessageId, replyText: string): Promise<boolean>;
    saveCredential(username: string, password: string): Promise<void>;
    sendMessage(content: string, providedTempUserId: TempUserId | null): Promise<TempUserId>;
}
