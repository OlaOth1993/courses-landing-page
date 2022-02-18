import { ISub_category } from "../abstract-entities/sub-category";

export interface ICategory {
	id: number;
	name: string;
	img: string;
	description: string;
	created_at?: any;
	category_id?: any;
//	sub_category: ISub_category[];
}
