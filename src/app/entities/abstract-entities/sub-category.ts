import { ICourse } from "../API-entities/course";

export interface ISub_category {
	id: number;
	name: string;
	img: string;
	description: string;
	created_at?: Date;
	category_id: number;
  courses: ICourse[];
  isShown: boolean; //this helps in design
}
