export interface ICustomerData {
  maxCount: number;
  count: number;
  data: {
    customerId: string;
    customer: string;
    periods: { amt: number; period: string; year: number }[];
  }[];
}

export interface IAggregateAmountYear {
  year: number;
  amount: number;
  month: [
    {
      month: string;
      amount: number;
    }
  ];
}
