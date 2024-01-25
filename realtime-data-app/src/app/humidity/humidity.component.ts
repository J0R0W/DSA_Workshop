import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { Chart, ChartDataset } from 'chart.js';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-humidity',
  templateUrl: './humidity.component.html',
  styleUrls: ['./humidity.component.css']
})
export class HumidityComponent implements OnInit {
  public humidity: number = 0;
  humidityChart: any;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    const humiditySocket = this.webSocketService.connect('ws://localhost:6060'); // Adjust the WebSocket URL accordingly
    humiditySocket.subscribe(
      (message) => {
        this.humidity = message.humidity;
        this.addData(this.humidityChart, "", this.humidity);
      },
      (err) => console.error(err),
      () => console.warn('Completed!')
    );

    this.humidityChart = new Chart('humidity-canvas', {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Humidity',
            data: [],
            borderColor: '#ffcc00', // Adjust the color as needed
            fill: false
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Humidity (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          }
        },
        plugins: {
          legend: {
            display: true
          }
        }
      }
    });
  }

  addData(chart: Chart, label: string, newData: number): void {
    if (chart.data && chart.data.labels) {
      chart.data.labels.push(label);
      chart.data.datasets.forEach((dataset: ChartDataset) => {
        if (dataset.data && Array.isArray(dataset.data)) {
          dataset.data.push(newData);
        }
      });
      chart.update();
    }
  }
}
