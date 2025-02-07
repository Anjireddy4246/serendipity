import { Component, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';

import funnel from 'highcharts/modules/funnel';
// funnel(Highcharts);

@Component({
  selector: 'widget-funnel-chart',
  template: `
    <highcharts-chart
      [Highcharts]="Highcharts"
      [options]="chartOptions"
      style="width: 100%; height: calc(100% - 40px); display: inline-block;">
    </highcharts-chart>
  `
})
export class FunnelChartComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = <any>{

  chart: {
      type: 'funnel'
    },
    title: { text: '' },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b> ({point.y:,.0f})',
          softConnector: true
        },
        center: ['40%', '50%'],
        neckWidth: '30%',
        neckHeight: '25%',
        width: '80%'
      }
    },
    legend: {
      enabled: false
    },
    series: [{
      name: 'Unique users',
      data: [
        ['Website visits', 15654],
        ['Downloads', 4064],
        ['Requested price list', 1987],
        ['Invoice sent', 976],
        ['Finalized', 846]
      ]
    }],

    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          plotOptions: {
            series: {
              dataLabels: {
                inside: true
              },
              center: ['50%', '50%'],
              width: '100%'
            }
          }
        }
      }]
    }

  };

  constructor() {

    funnel(this.Highcharts);
  }

  ngOnInit() {}

}

// https://github.com/highcharts/highcharts-angular

// https://github.com/highcharts/highcharts-angular/issues/138
