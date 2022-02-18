import { IReply } from './../abstract-entities/reply';
import { ISendReceiver } from './../abstract-entities/sender-receiver';
export interface IMessage{
    id: number;
    message: string;
    is_read: boolean;
    created_at: Date;
    sender_id: number;
    receiver_id: number;
    homework_id: number;
    message_id: number;
    sender: ISendReceiver;
    receiver: ISendReceiver;
    replies: IReply[];
    is_private: boolean;
}
export class IMessage implements IMessage {} 