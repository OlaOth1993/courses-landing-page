import { INotificationDetailes } from "../abstract-entities/Notification-details";

export interface INotification{
    id: number;
    type: string;
    event_type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: INotificationDetailes;
}