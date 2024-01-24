// In temperature.component.ts and humidity.component.ts
import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-humidity',
  templateUrl: './humidity.component.html',
  styleUrl: './humidity.component.css'
})

export class HumidityComponent implements OnInit {
  public humidity: number = 0;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    const temperatureSocket = this.webSocketService.connect('ws://localhost:6789');
    temperatureSocket.subscribe(
      (message) => this.humidity = message.humidity,
      (err) => console.error(err),
      () => console.warn('Completed!')
    );
  }
}
