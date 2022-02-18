import { ISolution } from 'src/app/entities/abstract-entities/solution';
export interface IHomework{
    id: number;
    name: string;
    url: string;
    mark: number;
    created_at: Date;
    course_id: number;
    solution: ISolution;
    user_homework: ISolution[];
}
export class IHomework implements IHomework {} 