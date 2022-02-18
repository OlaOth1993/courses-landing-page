import { IUser } from 'src/app/entities/API-entities/user';
export interface ISolution{
    id: number;
    url: string;
    mark: number;
    created_at: Date;
    user_course_id: number;
    user: IUser;
    homework_id: number;
    name: string;
}

export class ISolution implements ISolution {}