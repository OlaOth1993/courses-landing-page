import { ICourse } from 'src/app/entities/API-entities/course';
import { IUser } from "../API-entities/user";

export interface ITeacher {
	id: number;
	created_at?: any;
	course_id: number;
	student_id?: any;
	teacher_id: number;
	user_id: number;
	full_name: string;
	username: string;
	phone: number;
	profile_img: string;
	teacher_courses_count : number;
	teacher_courses_model: ICourse[];
	review_avg_review: number;
	cash: number;
	user_wallet: number;
	teacher_courses_model_count: number;
}
