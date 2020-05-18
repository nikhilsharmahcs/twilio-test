import { Component, OnInit } from '@angular/core';
import { connect, createLocalTracks, Room } from 'twilio-video'
@Component({
  selector: 'app-twillio',
  templateUrl: './twillio.component.html',
  styleUrls: ['./twillio.component.scss']
})
export class TwillioComponent implements OnInit {
key = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzU5NjA1NTZhNTJlZGMwOTBjNjdmM2UwNDM4ZjVmNTUyLTE1ODk4MDg0NzQiLCJpc3MiOiJTSzU5NjA1NTZhNTJlZGMwOTBjNjdmM2UwNDM4ZjVmNTUyIiwic3ViIjoiQUM5ZThlMGQ5YTg5ZmZjOWQxNTUwNDYxZDY5MGYxYTFmMiIsImV4cCI6MTU4OTgxMjA3NCwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiQUM5ZThlMGQ5YTg5ZmZjOWQxNTUwNDYxZDY5MGYxYTFmMiIsInZpZGVvIjp7InJvb20iOiJ0ZXN0LXYzIn19fQ.I68cnFUhUbq2bVfE-Xcw8I0BCm6WPFFvHjfcp3KRLSM`
room: Room;
error: Error;
  constructor() { }

  ngOnInit(): void {
    connect(this.key, { name: 'test-v3' }).then(room => {
        console.log(`Successfully joined a Room: ${room}`);
        this.room = room;
        room.on('participantConnected', participant => {
          console.log(`A remote Participant connected: ${participant}`);
        });
      }, error => {
        console.error(`Unable to connect to Room: ${error.message}`);
        this.error = error
      });
  }

}
