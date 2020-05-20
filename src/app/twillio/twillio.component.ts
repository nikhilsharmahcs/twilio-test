import { Component, OnInit } from '@angular/core';
import { connect, createLocalTracks, Room, Participant, LocalAudioTrack, createLocalVideoTrack, createLocalAudioTrack } from 'twilio-video'
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
// require('dotenv').config();

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = 'AC9e8e0d9a89ffc9d1550461d690f1a1f2';
const twilioApiKeySID = 'SKcd06e29637ba5ee4993ed98afa453adf';
const twilioApiKeySecret = 'uoeHj2e2BHhUxYpTTe78kkA2GwhVWAut';
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
    // return fetch(`http://localhost:8081/token?${params}`, { headers })
    // const { identity, roomName } = req.query;
    const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
        ttl: MAX_ALLOWED_SESSION_DURATION,
    });
    token.identity = name;
    console.log(token)
    const videoGrant = new VideoGrant({ room: room });
    token.addGrant(videoGrant);
    console.log(`issued token for ${name} in room ${room}`);
    return token.toJwt();
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
