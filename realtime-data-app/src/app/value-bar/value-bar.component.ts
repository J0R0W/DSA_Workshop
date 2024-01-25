// progress-bar.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../web-socket.service'; // Update the path to the actual path of your service
import { Subscription } from 'rxjs';
import { Console } from 'console';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-value-bar',
  templateUrl: './value-bar.component.html',
  styleUrls: ['./value-bar.component.css']
})
export class ValueBarComponent implements OnInit, OnDestroy {
  currentValue: number = 0;
  barWidth: number = 0;
  barOffset: number = 50; // start in the middle
  private wsSubscription: Subscription;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    const ws = this.webSocketService.connect('ws://localhost:6060'); // Put your actual WebSocket URL here
    this.wsSubscription = ws.subscribe(
      (msg) => {
        console.log(msg)
        if (msg && msg.steering !== undefined) {
          this.currentValue = msg.steering;
          this.updateBar();
        }
      },
      (err) => console.error(err),
      () => console.warn('Completed!')
    );
  }

  ngOnDestroy(): void {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
  }

  private updateBar(): void {
    console.log("updateBar");
    const maxRange = 300;
    this.barWidth = Math.abs(this.currentValue / maxRange * 100);
    this.barOffset = this.currentValue >= 0 ? 50 : 50 - this.barWidth;
  }
}
