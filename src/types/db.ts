export type Station = {
  id: string;
  code: string;
  name: string;
};

export type Product = {
  id: string;
  code: string;
  name: string;
};

export type Profile = {
  id: string;
  full_name: string;
  role: "accounting_head" | "owner" | "admin";
};

export type StationProfitability = {
  station_id: string;
  station_code: string;
  station_name: string;
  period: string;
  revenue: number;
  cogs: number;
  payroll_cost: number;
  utilities_cost: number;
  opex_cost: number;
  net_profit: number;
};
