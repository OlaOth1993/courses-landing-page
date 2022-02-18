import { IResource } from './resource';
export interface IFolder{
  id: number;
  name: string;
  created_at: string;
  folder_id: number;
  course_id: number;
  resources: IResource[];
  isChecked: boolean; // helps in design
  downloadPop: boolean; // helps in design
}
