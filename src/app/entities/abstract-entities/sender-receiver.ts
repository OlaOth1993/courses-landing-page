import { IUser } from './../API-entities/user';
export interface ISendReceiver{
    id: number;
    created_at: Date;
    course_id: number;
    student_id: number;
    teacher_id: number;
    user_id: number;
    user: IUser;
}