import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { Chart, ChartDataset } from 'chart.js';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.css']
})
export class TemperatureComponent implements OnInit {
  public temperature: number = 0;
  temperatureChart: any;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    const temperatureSocket = this.webSocketService.connect('ws://localhost:6060'); // Adjust the WebSocket URL accordingly
    temperatureSocket.subscribe(
      (message) => {
        this.temperature = message.temperature;
        //this.updateChartData(this.temperatureChart, message.temperature);

        this.addData(this.temperatureChart, "", this.temperature);
      },
      (err) => console.error(err),
      () => console.warn('Completed!')
    );
    const config = {

    };
    this.temperatureChart = new Chart('tempCan', {
      type: 'line',
      data: {
        labels: [], // Your labels here (usually x-axis labels, e.g., time or date)
        datasets: [
          {
            label: 'Temperature', // Label for the dataset
            data: [], // Your data points
            borderColor: '#3cba9f',
            fill: false
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true, // Optional: if you want the scale to start from zero
            title: {
              display: true,
              text: 'Temperature (°C)' // Optional: if you want to label the y-axis
            }
          },
          x: {
            title: {
              display: true,
              text: 'Time' // Optional: if you want to label the x-axis
            }
          }
        },
        plugins: {
          legend: {
            display: true // Set to false if you don't want to show the legend
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
          // Check if the total number of data points exceeds 100
          if (dataset.data.length > 10) {
            // Remove the oldest data point
            //dataset.data.shift();
          }
        }
      });
      chart.update();
    }
  }


}
