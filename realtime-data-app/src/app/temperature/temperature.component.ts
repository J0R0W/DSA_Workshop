// In temperature.component.ts and humidity.component.ts
import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.css']
})
export class TemperatureComponent implements OnInit {
  public temperature: number = 0;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    const temperatureSocket = this.webSocketService.connect('ws://localhost:8000/data');
    temperatureSocket.subscribe(
      (message) => this.temperature = message.temperature,
      (err) => console.error(err),
      () => console.warn('Completed!')
    );
  }
}
