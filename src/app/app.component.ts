import { AfterViewInit } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { IAggregateAmountYear, ICustomerData } from './app.service';
import data from './revenue-by-year.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'charts';
  public chartHTML!: string;

  customerData: ICustomerData = data;
  aggregateYear!: { [key: number]: number };
  aggregateMonth!: { [key: string]: number };
  @ViewChild('yearchart') yearChart!: ElementRef;
  ngAfterViewInit() {
    // for (let customerData of this.customerData.data) {
    //   let year:IAggregateAmountYear
    //   for (let period of customerData.periods) {
    //     const bobExists = customerData.periods.some(
    //       (person) => person.year === period.year
    //     );
    //     if (!bobExists) {
    //       year = {
    //         year: period.year,
    //         amount: 0,
    //         month:[{
    //           month:period.period,
    //           amount:period.amt
    //         }]
    //       };

    //     }
    //     this.aggregateYear.push(year);
    //   }
    // }
    this.aggregateYear = this.customerData.data.reduce((acc, customer) => {
      customer.periods.forEach((period) => {
        if (!acc[period.year]) {
          acc[period.year] = 0;
        }
        acc[period.year] += period.amt;
      });
      return acc;
    }, {} as { [key: number]: number });

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
    console.log(this.aggregateMonth);
    const chartOptions: Highcharts.Options = {
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
          id: key,
          name: key,
          data: [this.aggregateMonth[key]],
        })),
      },
    };
    Highcharts.chart(this.yearChart.nativeElement, chartOptions);
  }
}
