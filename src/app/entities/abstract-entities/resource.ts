export interface IResource{
  id: number;
  name: string;
  file_name: string;
  url: string;
  created_at: string;
  folder_id: number;
  isChecked: boolean; // helps in design
  extension: string; //helps in design
  user_course_id: number;
  resource_id: number;
}
export class IResource implements IResource {} 