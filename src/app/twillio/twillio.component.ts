import { Component, OnInit } from '@angular/core';
import { connect, createLocalTracks, Room, Participant } from 'twilio-video'
@Component({
  selector: 'app-twillio',
  templateUrl: './twillio.component.html',
  styleUrls: ['./twillio.component.scss']
})
export class TwillioComponent implements OnInit {
key = ``;
room: Room;
participant: Participant[] = [];
error: Error;
fetchToken(name: string, room: string, passcode: string) {
    const headers = new window.Headers();
    const params = new window.URLSearchParams({ identity:name, roomName:room });
    return fetch(`http://localhost:8081/token?${params}`, { headers })
  }
  constructor() { }

  ngOnInit(): void {
     
  }
  createRoom() {
}
joinRoom() {
    this.fetchToken(`Nik${Math.random()}`,'new-test','').then((res) => res.text()).then(res => {
        this.key = res;
        connect(this.key,).then(room => {
            console.log(`Successfully joined a Room: ${room}`);
            this.room = room;
            room.on('participantConnected', participant => {
                this.participant.push(participant);
              console.log(`A remote Participant connected: ${participant}`);
              console.log(participant)
            });
            room.on('participantDisconnected', participant => {
                console.log(`Participant disconnected: ${participant.identity}`);
                
              });
          }, error => {
            console.error(`Unable to connect to Room: ${error.message}`);
            this.error = error
          });
        
    });
  }
  disconnect() {
      this.room.disconnect();
  }

}
