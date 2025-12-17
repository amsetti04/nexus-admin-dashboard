export type TrendDirection = 'up' | 'down';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface KpiMetric {
  label: string;
  value: string;
  trend: number;
  trendDirection: TrendDirection;
  icon: string;
  bgColor: string;
}

export interface RevenueData {
  name: string;
  value: number;
}

export interface Transaction {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  date: string; // ISO string
  amount: number;
  status: TransactionStatus;
}

export interface DashboardData {
  kpiMetrics: KpiMetric[];
  revenueData: RevenueData[];
  recentTransactions: Transaction[];
}
