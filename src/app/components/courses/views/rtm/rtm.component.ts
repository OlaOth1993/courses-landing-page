import { Component, OnInit } from '@angular/core';
import AgoraRTM, { RtmChannel, RtmClient } from 'agora-rtm-sdk';
@Component({
  selector: 'app-rtm',
  templateUrl: './rtm.component.html',
  styleUrls: ['./rtm.component.scss']
})
export class RTMComponent implements OnInit {
  client: RtmClient;
  channel: RtmChannel;
  constructor() { }

  ngOnInit(): void {
    this.client = AgoraRTM.createInstance('7c3d832ea19b440abda7c1a015f82251', { enableLogUpload: false }); // Pass your App ID here.
    console.log(this.client);
    this.clientHandler();
    this.channel = this.client.createChannel("demoChannel");
    this.channelHandler();
  }
  clientHandler() {
    // Client Event listeners
    // Display messages from peer
    this.client.on('MessageFromPeer', function (message, peerId) {

      // document.getElementById("log").appendChild(document.createElement('div')).append("Message from: " + peerId + " Message: " + message)
    })
    // Display connection state changes
    this.client.on('ConnectionStateChanged', function (state, reason) {

      // document.getElementById("log").appendChild(document.createElement('div')).append("State changed To: " + state + " Reason: " + reason)

    })
  }
  channelHandler() {

    this.channel.on('ChannelMessage', function (message, memberId) {

      // document.getElementById("log").appendChild(document.createElement('div')).append("Message received from: " + memberId + " Message: " + message)
      console.log("Message received from: " + memberId + " Message: " + message);
    })
    // Display channel member stats
    this.channel.on('MemberJoined', function (memberId) {

      // document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " joined the channel")
      console.log(memberId + " joined the channel");
    })
    // Display channel member stats
    this.channel.on('MemberLeft', function (memberId) {

      // document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " left the channel")
      console.log(memberId + " left the channel");
    })
  }
}
