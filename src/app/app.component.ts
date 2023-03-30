import { AfterViewInit } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { IAggregateAmountYear, ICustomerData } from './app.service';
import data from './revenue-by-year.json';
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);
interface IDrill {
  name: number;
  type: string;
  id: number;
  data: Array<[string, number]>;
}
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
  years: number[] = [];
  drilldownSeries: IDrill[] = [];
  ngAfterViewInit(): void {
    // Aggregate data by year

    this.customerData.data.forEach((customer) => {
      customer.periods.forEach((period) => {
        if (this.years.hasOwnProperty(period.year)) {
          this.years[period.year] += period.amt;
        } else {
          this.years[period.year] = period.amt;
        }
      });
    });

    // Create year series for chart
    const yearSeries = Object.keys(this.years).map((year) => {
      return { name: year, y: this.years[Number(year)], drilldown: year };
    });

    // Create drilldown series for each year

    Object.keys(this.years).forEach((year) => {
      const yearData: Array<[string, number]> = this.customerData.data.map(
        (customer) => {
          const amt = customer.periods
            .filter((period) => period.year === Number(year))
            .reduce((sum, period) => sum + period.amt, 0);
          return ['a', amt];
        }
      );

      this.drilldownSeries.push({
        name: Number(year),
        type: 'line',
        id: Number(year),
        data: yearData,
      });
    });
    console.log(yearSeries);
    console.log(this.drilldownSeries[0]);
    Highcharts.chart('yearchart', {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Year-wise Data',
      },
      xAxis: {
        categories: Object.keys(this.years),
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
          data: yearSeries,
        },
      ],
      drilldown: {
        series: this.drilldownSeries,
      },
    });
  }
}
