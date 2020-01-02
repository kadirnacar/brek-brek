export interface Message {
    type: MessageType;
    time: Date;
    message: string;
}
export enum MessageType {
    Send,
    Receive
}