import { AfterViewInit } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { IAggregateAmountYear, ICustomerData } from './app.service';
import data from './revenue-by-year.json';
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'charts';
  customerData: ICustomerData = data;
  aggregateYear!: { [key: number]: number };
  aggregateMonth!: { [key: string]: number };
  @ViewChild('yearchart') yearChart!: ElementRef;

  ngAfterViewInit(): void {
    // get the aggregate amount group by year
    this.aggregateYear = this.customerData.data.reduce((acc, customer) => {
      customer.periods.forEach((period) => {
        if (!acc[period.year]) {
          acc[period.year] = 0;
        }
        acc[period.year] += period.amt;
      });
      return acc;
    }, {} as { [key: number]: number });

    // get the aggregate amount group by month
    this.aggregateMonth = this.customerData.data.reduce((acc, customer) => {
      customer.periods.forEach((period) => {
        const { year, period: month } = period;
        const key = `${year}-${month}`;
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += period.amt;
      });
      return acc;
    }, {} as { [key: string]: number });
    console.log(this.aggregateYear)
    console.log(this.aggregateMonth)
    // initialize highcharts
    Highcharts.chart('yearchart', {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Year-wise Data',
      },
      xAxis: {
        categories: Object.keys(this.aggregateYear),
        title: {
          text: 'Year',
        },
      },
      yAxis: {
        title: {
          text: 'Data',
        },
      },
      series: [
        {
          type: 'line',
          name: 'Data',
          data: Object.keys(this.aggregateYear).map((key) => ({
            name: key,
            y: this.aggregateYear[Number(key)],
            drilldown: key,
          })),
        },
      ],
      drilldown: {
        series: Object.keys(this.aggregateMonth).map((key) => ({
          type: 'line',
          id: key.substring(0,4),
          name:key.substring(0,4),
          data: [this.aggregateMonth[key]],
        })),
      },
    });
  }
}
