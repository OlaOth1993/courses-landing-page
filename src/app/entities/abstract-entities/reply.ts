import { ISendReceiver } from "./sender-receiver";

export interface IReply{
    id: number,
    message: string,
    is_read: boolean,
    created_at: Date,
    sender_id: number,
    receiver_id: number,
    homework_id: number,
    message_id: number;
    sender: ISendReceiver;
    receiver: ISendReceiver;

}