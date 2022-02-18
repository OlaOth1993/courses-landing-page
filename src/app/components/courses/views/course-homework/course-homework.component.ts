import { IMessage } from './../../../../entities/API-entities/message';
import { ISolution } from './../../../../entities/abstract-entities/solution';
import { HomeworkAction } from './../../action/homework-action';
import { IHomework } from './../../../../entities/abstract-entities/homework';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CoursesService } from '../../courses.service';
import { IsFocusableConfig } from '@angular/cdk/a11y';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { ITeacher } from 'src/app/entities/abstract-entities/teacher';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-course-homework',
  templateUrl: './course-homework.component.html',
  styleUrls: ['./course-homework.component.scss']
})
export class CourseHomeworkComponent implements OnInit {
  public files: NgxFileDropEntry[] = [];
  homeworkList: IHomework[] = [];
  homework: IHomework;
  fileUpload: string;
  fileURL: string;
  solution: ISolution;
  solutionList: ISolution [] = [];
  messageList: IMessage [] = [];
  messageSection: FormGroup;
  homeworkWithoutSol: IHomework [] = [];
  homeworkWithSol:IHomework [] = [];
  teacher: ITeacher;
  teacher_id: number;
  course_id: number;
  user_course_id: number;
  constructor(private datepipe: DatePipe,
    private CoursesService: CoursesService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private storage: StorageService,
    ) {
      this.messageSection = this.fb.group({
        message : new FormControl(),
        course_id: new FormControl(),
        is_private: new FormControl(),
      });
     }

  ngOnInit(): void {
   // console.log("rote",this.router.getCurrentNavigation().extras.state.exa);    

    this.route.params.subscribe((params) => (this.teacher_id = params["id"]));
    console.log('this.teacher_id',this.teacher_id)
    this.course_id = this.storage.getLocalObject('course_id');
    this.user_course_id = this.storage.getLocalObject('user_course_id');
    console.log('this.course_id',this.course_id);
    this.requestData();

    this.solution = new ISolution();
  }
  ngOnDestroy(): void {
    this.storage.removeLocalObject('course_id');
    this.storage.removeLocalObject('user_course_id');

  }

  requestData(): void {
    this.getHomeworks(this.user_course_id); //problem
    this.getMessages();
    this.getTeacherInfo(this.teacher_id);
  }
  public dropped(files: NgxFileDropEntry[],id :number) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(file);


          this.fileUpload = droppedFile.relativePath;
          const formData = new FormData();
          console.log("id",id)
          formData.append("file",file, this.fileUpload);
          this.CoursesService.uploadFile(formData).subscribe((response: any) => {
            console.log(response);

            this.fileURL = response.data.url;
            console.log("this.fileURL",this.fileURL)
            if(response.status= "OK")
            this.uploadSolution(id)
          });

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
  public fileOver(event){
   //console.log('fileover', event);
  }

  public fileLeave(event){
    //console.log('fileleave', event);
  }
    async uploadFile(event, id:number){
      this.fileUpload = event.target.files[0];
      const formData = new FormData();
      console.log("id",id)
      formData.append("file", this.fileUpload);
      this.CoursesService.uploadFile(formData).subscribe((response: any) => {
        console.log(response);

        this.fileURL = response.data.url;
        console.log("this.fileURL",this.fileURL)
        if(response.status= "OK")
        this.uploadSolution(id)
      });

    }
    async uploadSolution(id: number ){

      this.solution.homework_id = id;
      this.solution.user_course_id = 3; // from previous form
      this.solution.url = this.fileURL;
      this.CoursesService.uploadSolution(this.solution).subscribe(
        (response: any) => {

          this.solutionList = response.data;

          console.log('res', response)
          console.log(this.solutionList)
        },
        (error: HttpErrorResponse) => {
          console.error(error.status);
        }
      );

    }
  downloadFile(path: string){
      window.open(path, '_blank');
  }
  //user_course_id
  getHomeworks(user_course_id: number){
    this.CoursesService.getHomeworkWithSolution(user_course_id).subscribe(
      (response: any) => {

        this.homeworkList = response.data;
        this.homeworkList.forEach((hom: IHomework) => {
          if(hom.user_homework.length == 0){
            this.homeworkWithoutSol.push(hom);
          }
          else if(hom.user_homework.length != 0){
          this.homeworkWithSol.push(hom)
          }
         });
         console.log(" this.homeworWithSol", this.homeworkWithSol)
         console.log(" this.homeworkWithoutSol", this.homeworkWithoutSol)

        console.log('res', response)
        console.log(this.homeworkList)
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
  getMessages(){
    this.CoursesService.getMessageStudent(this.course_id,1).subscribe(
      (response: any) => {

        this.messageList = response.data;

        console.log('resMessage', response)
        console.log(this.messageList)
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
  sendMessage(data){
    if(this.messageSection.valid){
      data.is_private = 1;
      data.course_id = this.course_id; 
      this.CoursesService.createStudentMessage(data).subscribe(
      (response: any) =>{
        console.log("responseCreate",response);
      //this.messageList.splice(0,0,data);
      this.messageList.push(data);
      this.messageSection.reset();
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
    }
    console.log("formgroup",data)
  }
  deleteSolution(sol: ISolution, homework: IHomework){
   // console.log('(user_homework_id', user_homework_id,'homework',homework)

    this.CoursesService.deleteSolution(sol.id).subscribe(
      (response: any) => {
        console.log('res', response)

       this.homeworkWithSol[homework.id].user_homework.splice(this.homeworkWithSol[homework.id].user_homework.indexOf(sol), 1);
        console.log("this.homeworkWithSol[homework.id].user_homework",this.homeworkWithSol[homework.id].user_homework)
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
    }
    getTeacherInfo(teacher_id:number): void {
      this.CoursesService.getTeacherInfo(teacher_id).subscribe(
        (response: any) => {

         this.teacher = response.data;
          console.log('res', response)
         console.log(' this.teacher', this.teacher)
        },
        (error: HttpErrorResponse) => {
          console.error(error.status);
        }
      );
    }
}
