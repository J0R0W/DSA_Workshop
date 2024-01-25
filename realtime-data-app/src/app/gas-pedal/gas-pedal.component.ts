// gas-pedal.component.ts

import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { WebSocketService } from '../web-socket.service'; // Update the path to the actual path of your service
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gas-pedal',
  templateUrl: './gas-pedal.component.html',
  styleUrls: ['./gas-pedal.component.css']
})
export class GasPedalComponent implements OnInit, OnDestroy {
  currentValue: number = 0;
  barWidth: number = 0;
  private wsSubscription: Subscription;

  constructor(
    private webSocketService: WebSocketService,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    const ws = this.webSocketService.connect('ws://localhost:6060'); // Assuming the WebSocket URL is set in the global config
    this.wsSubscription = ws.subscribe(
      (msg) => {
        console.log(msg);
        if (msg && msg.gas !== undefined) {
          this.zone.run(() => {
            this.currentValue = msg.gas;
            this.updateBar();
          });
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
    const maxRange = 100; // Max range for gas pedal
    this.barWidth = this.currentValue / maxRange * 100;
  }
}
