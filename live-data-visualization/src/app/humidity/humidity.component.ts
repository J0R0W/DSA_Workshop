// In temperature.component.ts and humidity.component.ts
import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-humidity',
  standalone: true,
  imports: [],
  templateUrl: './humidity.component.html',
  styleUrl: './humidity.component.css'
})
export class HumidityComponent {

}

export class TemperatureComponent implements OnInit {
  public humidity: number = 0;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    const temperatureSocket = this.webSocketService.connect('wss://your-websocket-url');
    temperatureSocket.subscribe(
      (message) => this.humidity = message.temperature,
      (err) => console.error(err),
      () => console.warn('Completed!')
    );
  }
}
