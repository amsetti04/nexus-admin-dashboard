import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import {
  DashboardData,
  KpiMetric,
  RevenueData,
  Transaction,
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  /**
   * Simulates an API call to fetch dashboard data
   * Uses RxJS delay to simulate network latency
   */
  getDashboardData(): Observable<DashboardData> {
    const kpiMetrics: KpiMetric[] = [
      {
        label: 'Total Revenue',
        value: '$45,231',
        trend: 12.5,
        trendDirection: 'up',
        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        bgColor: 'bg-indigo-500',
      },
      {
        label: 'Active Users',
        value: '2,345',
        trend: 8.2,
        trendDirection: 'up',
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
        bgColor: 'bg-green-500',
      },
      {
        label: 'Conversion Rate',
        value: '3.24%',
        trend: 2.1,
        trendDirection: 'down',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        bgColor: 'bg-purple-500',
      },
      {
        label: 'Avg. Order Value',
        value: '$124.50',
        trend: 5.7,
        trendDirection: 'up',
        icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
        bgColor: 'bg-orange-500',
      },
    ];

    const revenueData: RevenueData[] = [
      { name: 'Jan', value: 42000 },
      { name: 'Feb', value: 38000 },
      { name: 'Mar', value: 45000 },
      { name: 'Apr', value: 51000 },
      { name: 'May', value: 49000 },
      { name: 'Jun', value: 62000 },
      { name: 'Jul', value: 58000 },
      { name: 'Aug', value: 67000 },
      { name: 'Sep', value: 71000 },
      { name: 'Oct', value: 69000 },
      { name: 'Nov', value: 78000 },
      { name: 'Dec', value: 82000 },
    ];

    const recentTransactions: Transaction[] = this.generateMockTransactions(25);

    // Simulate network latency (800ms)
    return of({ kpiMetrics, revenueData, recentTransactions }).pipe(delay(800));
  }

  /**
   * Generates mock transaction data
   */
  private generateMockTransactions(count: number): Transaction[] {
    const names = [
      'John Doe',
      'Jane Smith',
      'Michael Johnson',
      'Emily Davis',
      'David Wilson',
      'Sarah Brown',
      'James Taylor',
      'Emma Anderson',
      'Robert Thomas',
      'Olivia Martinez',
      'William Garcia',
      'Sophia Rodriguez',
      'Christopher Lee',
      'Isabella Walker',
      'Daniel Hall',
      'Mia Allen',
      'Matthew Young',
      'Charlotte King',
      'Joseph Wright',
      'Amelia Lopez',
    ];

    const transactions: Transaction[] = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('');

      // Generate dates within the last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);

      // Weight statuses: 70% completed, 20% pending, 10% failed
      const rand = Math.random();
      let status: 'completed' | 'pending' | 'failed';
      if (rand < 0.7) {
        status = 'completed';
      } else if (rand < 0.9) {
        status = 'pending';
      } else {
        status = 'failed';
      }

      transactions.push({
        id: `TXN-${String(i + 1).padStart(4, '0')}`,
        user: {
          name,
          avatar: initials,
        },
        date: date.toISOString(),
        amount: Math.floor(Math.random() * 5000) + 100,
        status,
      });
    }

    // Sort by date descending (most recent first)
    return transactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
}
