import { ILanguage } from "../abstract-entities/language";
import { IPrev_skill } from "../abstract-entities/prev-skill";
import { ISchedule } from "../abstract-entities/Schedule";
import { ITeacher } from "../abstract-entities/teacher";
import { ICategory } from "./category";
import { IUser } from "./user";

export interface ICourse {
	id: number;
	name: string;
	img: string;
	description: string;
	start_time: string;
	end_time: Date;
	duration: number;
	number_hour: number;
	effort: number;
	level: string;
	schedule: ISchedule[];
	target: string;
	prev_skill: IPrev_skill[];
	url_video?: string;
	external_url_video?: string;
	student_number: number;
	price: number;
	language: ILanguage;
	created_at?: Date;
	category_id: number;
	review?: any;
	reviews: any[];
	teacher_user: ITeacher;
	user_courses: any[];
	students_count: number;
	next_page_url: string;
	current_page: number;
	last_page: number;
	users: IUser[];
	teacher: ITeacher;
	complete_ratio: number;
	category: ICategory;
	parent_category_id: number;

}
