// progress-bar.component.ts

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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
  @Input() valueType: string; // E.g., 'SteeringMoment', 'SteeringWheelAngle'
  @Input() webSocketProperty: string; // E.g., 'steering', 'wheelAngle'
  @Input() minRange: number = 0; // Default min range
  @Input() maxRange: number = 100; // Default max range
  @Input() isPositiveOnly: boolean = false; // Whether the value is only positive
  currentValue: number = 0;
  barWidth: number = 0;
  barOffset: number = 50; // start in the middle
  private wsSubscription: Subscription;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    const ws = this.webSocketService.connect('ws://192.168.150.1:6060'); // Put your actual WebSocket URL here
    this.wsSubscription = ws.subscribe(
      (msg) => {
        console.log(msg)
        const value = msg[this.webSocketProperty]; // Use the dynamic property
        if (value !== undefined) {
          this.currentValue = value;
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
    if (this.isPositiveOnly) {
      // For positive-only values
      this.barWidth = (this.currentValue / this.maxRange) * 100;
      this.barOffset = 0; // Bar starts from the left edge
    } else {
      // For full-range values (negative to positive)
      const totalRange = this.maxRange - this.minRange;
      const normalizedValue = this.currentValue - this.minRange; // Normalize the current value to start from 0
      this.barWidth = (Math.abs(this.currentValue) / totalRange) * 100;
      console.log(totalRange, normalizedValue, this.barWidth)

      // Calculate offset
      // If currentValue is less than midpoint, bar grows from the middle to the left
      // If currentValue is more than midpoint, bar grows from the middle to the right
      const midpoint = totalRange / 2;
      if (this.currentValue < 0) {
        this.barOffset = 50 - this.barWidth // Offset to the left
      } else {
        this.barOffset = 50; // Starts from the middle
      }
    }
  }

}
