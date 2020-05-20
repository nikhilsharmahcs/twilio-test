import { Component, OnInit } from '@angular/core';
import { connect, createLocalTracks, Room, Participant, LocalAudioTrack, createLocalVideoTrack, createLocalAudioTrack } from 'twilio-video'
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
        connect(this.key,{audio: true, video: {width: 640}}).then(room => {
            console.log(`Successfully joined a Room: ${room}`);
            this.room = room;
            console.log(room) 
            createLocalVideoTrack().then(track => {
                const localMediaContainer = document.getElementById('local-media');
                let a = document.createElement('p')
                    a.innerText= `Hello ${this.room.localParticipant.identity}`
                localMediaContainer.appendChild(track.attach());
                localMediaContainer.appendChild(a)
              });
              createLocalAudioTrack().then(track => {
                const localMediaContainer = document.getElementById('local-media');
                localMediaContainer.appendChild(track.attach());
              });
            this.room.participants.forEach(par => {
                console.log('Already present banda ',par)
                // par.tracks.forEach( track => {
                //     console.log('Already present banda track',track)
                //     let a = document.createElement('p')
                //         a.innerText= `Hello ${par.identity}`
                //     document.getElementById('remote-media-div').appendChild(track.track.attach());
                //     document.getElementById('remote-media-div').appendChild(a)
                // })
                par.on('trackSubscribed', track => {
                    let a = document.createElement('p')
                        a.innerText= `Hello ${par.identity}`
                    document.getElementById('remote-media-div').appendChild(track.attach());
                    document.getElementById('remote-media-div').appendChild(a)
                })
            })
            room.on('participantConnected', participant => {
                this.participant.push(participant);
              console.log(`A remote Participant connected: ${participant}`);
              console.log(participant)
              participant.on('trackSubscribed', track => {
                let a = document.createElement('p')
                        a.innerText= `Hello ${participant.identity}`
                document.getElementById('remote-media-div').appendChild(track.attach());
                document.getElementById('remote-media-div').appendChild(a)
              });
            });
            room.on('participantDisconnected', participant => {
                console.log(`Participant disconnected: ${participant.identity}`);
              });
              room.on('disconnected', room => {
                // Detach the local media elements
                room.localParticipant.tracks.forEach(publication => {
                  const attachedElements = publication.track.detach();
                  attachedElements.forEach(element => element.remove());
                });
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
