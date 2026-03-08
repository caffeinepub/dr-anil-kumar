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
    content: string;
    tempUserId: TempUserId;
    timestamp: bigint;
}
export type TempUserId = string;
export interface backendInterface {
    getAllMessages(): Promise<Array<Message>>;
    sendMessage(content: string, providedTempUserId: TempUserId | null): Promise<TempUserId>;
}
