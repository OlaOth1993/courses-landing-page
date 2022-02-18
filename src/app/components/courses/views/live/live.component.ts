import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import {
  AgoraClient,
  AgoraConfig,
  ClientEvent,
  NgxAgoraService,
  Stream,
  StreamEvent,
} from 'ngx-agora';
import { CoursesService } from '../../courses.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {
  private client: AgoraClient;
  private screenClient: AgoraClient;
  localStream: Stream;
  private uid: number;

  localStreamStaus: any = {};
  teacherScreenId = 'full-screen-video';
  studentCalls: Array<any> = [];
  token =
    '0067c3d832ea19b440abda7c1a015f82251IADifPwOZLtrdD4+wlPj/W+eeEGLYbp7UGsTZ+ANlCsSjunZLEwAAAAAEAAHv5x5P7hNYQEAAQBBuE1h';
  clientRole: any;
  teacherId: number;
  courseId: number;
  volumeLevel = 0;
  modalRef: NgbModalRef;

  constructor(
    private ngxAgoraService: NgxAgoraService,
    private coursesService: CoursesService,
    private _modalService: NgbModal,
    private _location: Location,
    private route: ActivatedRoute,
  ) {
    this.uid = this.coursesService.uid;
    this.clientRole = 'audience';
    this.localStreamStaus = { hasVideo: true, hasAudio: true };
    this.route.parent.params.subscribe((params) => {
      this.courseId = params['id'];
      console.warn('courseId', this.courseId)
    })
  }

  ngOnInit() {
    console.warn(this.coursesService.userType);
    this.setCourseTeacher();
    if (this.ngxAgoraService.AgoraRTC.checkSystemRequirements()) {
      this.initLiveConnection();
    }

  }

  join(
    onSuccess?: (uid: number | string) => void,
    onFailure?: (error: Error) => void
  ): void {
    this.setClientRole();
    this.client.join(this.token, 'foo-bar', this.uid, onSuccess, onFailure);
  }
  initLiveConnection() {
    /*
     *1- Create client
     */
    this.client = this.ngxAgoraService.createClient({
      mode: 'live',
      codec: 'vp8',
    });
    /*
     2- Listening to client events
     */
    this.assignClientHandlers(this.client);
    /**
     3- set Client role
     4- join to channel
     5- create local stream (if host role create it immediately if not change the role to host )
     6- publish the local stream after initLocalStream succese
     */
    this.join(
      () => this.setStreamRole(),
      (error) => console.error(error)
    );
  }
  /**
   * Attempts to connect to an online chat room where users can host and receive A/V streams.
   */
  setStreamRole(): void {
    if (this.clientRole == 'host') {
      this.createStream();
    } else {
      this.clientRole = 'host';
      this.client.setClientRole(this.clientRole);
      this.createStream();
    }
  }
  createStream() {
    this.localStream = this.ngxAgoraService.createStream({
      streamID: this.uid,
      audio: true,
      video: true,
      screen: false,
    });
    this.assignLocalStreamHandlers();

    this.initLocalStream(() => this.publish());
  }
  /**
   * Attempts to upload the created local A/V stream to a joined chat room.
   */
  publish(): void {
    this.client.publish(this.localStream, (err) =>
      console.log('Publish local stream error: ' + err)
    );
  }

  setClientRole() {
    if (this.coursesService.userType == 'teacher') {
      this.clientRole = 'host';
      this.client.setClientRole(this.clientRole);
    } else this.client.setClientRole(this.clientRole);
  }
  private assignClientHandlers(client: AgoraClient): void {
    client.on(ClientEvent.LocalStreamPublished, (evt) => {
      console.log('Publish local stream successfully');
    });

    client.on(ClientEvent.Error, (error) => {
      console.log('Got error msg:', error.reason);
      if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
        client.renewChannelKey(
          '',
          () => console.log('Renewed the channel key successfully.'),
          (renewError) =>
            console.error('Renew channel key failed: ', renewError)
        );
      }
    });

    client.on(ClientEvent.RemoteStreamAdded, (evt) => {
      const stream = evt.stream as Stream;
      console.warn(stream, 'RemoteStreamAdded', evt);
      this.client.subscribe(stream, { audio: true, video: true }, (err) => {
        console.log('Subscribe stream failed', err);
      });

    });

    client.on(ClientEvent.RemoteStreamSubscribed, (evt) => {
      const stream = evt.stream as Stream;

      console.warn(stream.getId(), 'RemoteStreamSubscribed');
      this.getUserType(stream);
    });

    client.on(ClientEvent.RemoteStreamRemoved, (evt) => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        console.warn(`Remote stream is removed ${stream.getId()}`);
        // this.studentCalls = [];
      }
    });

    client.on(ClientEvent.PeerLeave, (evt) => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.handleStudents(stream);
        console.warn(`${evt.uid} left from this channel`, this.studentCalls, this.localStream);
      }
    });
    client.on(ClientEvent.ConnectionStateChanged, (evt) => {
      console.log(evt, 'ConnectionStateChanged');

    });
    client.on(ClientEvent.RemoteAudioMuted, (evt) => {
      console.log(evt);
      console.warn('mutedAudio', evt);
      this.studentCalls = this.studentCalls.map(student => {
        if (student.stream.getId() == evt.uid)
          student.hasAudio = false;
        return student
      })
      console.warn(this.studentCalls, 'this.studentCalls after mute audio');
    });
    client.on(ClientEvent.RemoteAudioUnmuted, (evt) => {
      console.log(evt);
      console.warn('mutedAudio', evt);
      this.studentCalls = this.studentCalls.map(student => {
        if (student.stream.getId() == evt.uid)
          student.hasAudio = true;
        return student
      })
    });
    client.on(ClientEvent.RemoveVideoMuted, (evt) => {
      console.log(evt);
      console.warn('mutedVideo', evt);
      this.studentCalls = this.studentCalls.map(student => {
        if (student.stream.getId() == evt.uid)
          student.hasVideo = false;
        return student
      })
    });
    client.on(ClientEvent.RemoteVideoUnmuted, (evt) => {
      console.log(evt);
      console.warn('unmutedVideo', evt);
      this.studentCalls = this.studentCalls.map(student => {
        if (student.stream.getId() == evt.uid)
          student.hasVideo = true;
        return student
      })
    });
  }

  private assignLocalStreamHandlers(): void {

    this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
      console.log('accessAllowed');
    });

    // The user has denied access to the camera and mic.
    this.localStream.on(StreamEvent.MediaAccessDenied, () => {
      console.log('accessDenied');
    });
  }

  private initLocalStream(onSuccess?: () => any): void {
    this.localStream.init(
      () => {
        // The user has granted access to the camera and mic.
        if (this.coursesService.userType == 'teacher') {
          // this.mainStream.stream = this.localStream;
          this.localStream.play(this.teacherScreenId);
        } else if (this.coursesService.userType == 'student') {
          const id = this.getStudentId(this.localStream);
          this.studentCalls.push({
            HTMLid: id,
            id: this.localStream.getId(),
            stream: this.localStream,
            hasVideo: true,
            hasAudio: true,
          });
          setTimeout(() => this.localStream.play(id), 1000);
        }
        if (onSuccess) {
          onSuccess();
        }
      },
      (err) => console.error('getUserMedia failed', err)
    );
  }

  private getStudentId(stream: Stream): string {
    return `student-${stream.getId()}`;
  }

  close() {
    this.modalRef.close();
  }

  endLiveConfirm(content) {
    this.modalRef = this._modalService.open(content, { centered: true });
  }
  endLive() {
    this.client.leave(
      () => {
        console.log('client leaves channel');
        this.localStream.stop(); // stop the camera stream playback
        this.localStream.close(); // clean up and close the camera stream
        this.client.unpublish(this.localStream); // unpublish the camera stream
        if (this.coursesService.userType == 'teacher') {
          this.studentCalls.forEach((student) => {
            student.stream.stop();
            student.stream.close();
          })
          this.studentCalls = [];
        }
        if (this.modalRef)
          this.close();
        this._location.back();
      },
      (err) => console.error('getUserMedia failed', err)
    );
  }
  setCourseTeacher() {
    this.coursesService.getCourse(this.courseId).subscribe(
      (response: any) => {
        let course = response.data;
        console.warn(course, "course");
        this.teacherId = course.teacher.id;
      },
      (error: HttpErrorResponse) => { }
    );
  }

  getUserType(stream: Stream, cid?: number) {
    if (this.teacherId == stream.getId()) {
      stream.play(this.teacherScreenId);
      // this.mainStream = stream;
    } else {
      const id = this.getStudentId(stream);
      this.studentCalls.push({
        HTMLid: id,
        id: this.localStream.getId(),
        stream: stream,
        hasVideo: true,
        hasAudio: true,
      });
      setTimeout(() => stream.play(id), 1000);
    }
  }
  handleStudents(stream: Stream) {
    if (this.teacherId == stream.getId()) {
      this.endLive();
      this.studentCalls = [];
    } else {
      this.studentCalls = this.studentCalls.filter(
        (call) => call.HTMLid !== `${this.getStudentId(stream)}`
      );

    }
  }
  toggleAudio(studentObjstream?: any) {
    if (studentObjstream) {
      if (this.coursesService.userType == 'teacher') { //If the local user is teacher can change audio status
        if (studentObjstream.hasAudio) {
          studentObjstream.stream.muteAudio();
          studentObjstream.hasAudio = false;
        } else {
          studentObjstream.stream.unmuteAudio();
          studentObjstream.hasAudio = true;
        }
      }
    } else {
      if (this.localStreamStaus.hasAudio) {
        this.localStream.muteAudio();
        this.localStreamStaus.hasAudio = false;
      } else {
        this.localStream.unmuteAudio();
        this.localStreamStaus.hasAudio = true;
      }
    }
  }
  toggleVideo(studentObjstream?: any) {
    if (studentObjstream) {
      if (this.coursesService.userType == 'teacher') { //If the local user is teacher can change video status
        if (studentObjstream.hasVideo) {
          studentObjstream.stream.muteVideo();
          studentObjstream.hasVideo = false;
        } else {
          studentObjstream.stream.unmuteVideo();
          studentObjstream.hasVideo = true;
        }
      }
    } else {
      if (this.localStreamStaus.hasVideo) {
        this.localStream.muteVideo();
        this.localStreamStaus.hasVideo = false;
      } else {
        this.localStream.unmuteVideo();
        this.localStreamStaus.hasVideo = true;
      }
    }
  }
  shareScreen() {
    // this.localStream.stop();
    // this.localStream.close();
    // this.client.unpublish(this.localStream);
    this.screenClient = this.ngxAgoraService.createClient({ mode: 'live', codec: 'vp8' });

    this.assignClientHandlers(this.screenClient);
    this.screenClient.setClientRole("host");
    let screenId = 'screen';
    this.screenClient.join(this.token, 'foo-bar', this.uid);
    console.warn(this.uid, 'in sharescreen');
    let screenStream = this.ngxAgoraService.createStream({ streamID: this.uid, audio: false, video: false, screen: true });

    screenStream.setScreenProfile("480p_1");
    screenStream.init(() => {
      console.log('init local stream success');
      // play stream with html element id "local_stream"
      screenStream.play(this.teacherScreenId);
      this.screenClient.publish(screenStream, (err) =>
        console.log('Publish local stream error: ' + err)
      );
      this.screenClient.on(ClientEvent.LocalStreamPublished, (evt) =>
        console.log('Publish local stream successfully')
      );
    },
      (err) => console.log('getUserMedia failed', err)
    );
  }
  whiteBoard() {

  }
  onInputChange(event: any) {
    this.volumeLevel = event.value;
  }
  setVolume(event: any) {
    console.warn('on change', event.value);
    this.localStream.setAudioVolume(event.value);
  }

}
