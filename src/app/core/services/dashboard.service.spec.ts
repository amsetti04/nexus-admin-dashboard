import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { DashboardData } from '../models/dashboard.model';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [DashboardService],
    }).compileComponents();
    
    service = TestBed.inject(DashboardService);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDashboardData', () => {
    it('should return dashboard data with correct structure', (done) => {
      service.getDashboardData().subscribe((data: DashboardData) => {
        // Assert structure
        expect(data).toBeDefined();
        expect(data.kpiMetrics).toBeDefined();
        expect(data.revenueData).toBeDefined();
        expect(data.recentTransactions).toBeDefined();

        // Assert KPI metrics
        expect(Array.isArray(data.kpiMetrics)).toBe(true);
        expect(data.kpiMetrics.length).toBe(4);
        expect(data.kpiMetrics[0]).toHaveProperty('label');
        expect(data.kpiMetrics[0]).toHaveProperty('value');
        expect(data.kpiMetrics[0]).toHaveProperty('trend');
        expect(data.kpiMetrics[0]).toHaveProperty('trendDirection');
        expect(data.kpiMetrics[0]).toHaveProperty('icon');
        expect(data.kpiMetrics[0]).toHaveProperty('bgColor');

        // Assert revenue data
        expect(Array.isArray(data.revenueData)).toBe(true);
        expect(data.revenueData.length).toBe(12);
        expect(data.revenueData[0]).toHaveProperty('name');
        expect(data.revenueData[0]).toHaveProperty('value');

        // Assert transactions
        expect(Array.isArray(data.recentTransactions)).toBe(true);
        expect(data.recentTransactions.length).toBe(25);
        expect(data.recentTransactions[0]).toHaveProperty('id');
        expect(data.recentTransactions[0]).toHaveProperty('user');
        expect(data.recentTransactions[0]).toHaveProperty('date');
        expect(data.recentTransactions[0]).toHaveProperty('amount');
        expect(data.recentTransactions[0]).toHaveProperty('status');

        done();
      });
    });

    it('should simulate network delay of 800ms using fake timers', () => {
      jest.useFakeTimers();

      let dataReceived = false;
      service.getDashboardData().subscribe(() => {
        dataReceived = true;
      });

      // Data should not be received immediately
      expect(dataReceived).toBe(false);

      // Advance timers by 799ms - still no data
      jest.advanceTimersByTime(799);
      expect(dataReceived).toBe(false);

      // Advance timers by 1ms more (total 800ms) - data should be received
      jest.advanceTimersByTime(1);
      expect(dataReceived).toBe(true);

      jest.useRealTimers();
    });

    it('should return KPI metrics with correct values', (done) => {
      service.getDashboardData().subscribe((data) => {
        const kpis = data.kpiMetrics;

        // Check first KPI (Total Revenue)
        expect(kpis[0].label).toBe('Total Revenue');
        expect(kpis[0].value).toBe('$45,231');
        expect(kpis[0].trend).toBe(12.5);
        expect(kpis[0].trendDirection).toBe('up');
        expect(kpis[0].bgColor).toBe('bg-indigo-500');

        // Check second KPI (Active Users)
        expect(kpis[1].label).toBe('Active Users');
        expect(kpis[1].value).toBe('2,345');
        expect(kpis[1].trend).toBe(8.2);
        expect(kpis[1].trendDirection).toBe('up');

        // Check third KPI (Conversion Rate)
        expect(kpis[2].label).toBe('Conversion Rate');
        expect(kpis[2].value).toBe('3.24%');
        expect(kpis[2].trend).toBe(2.1);
        expect(kpis[2].trendDirection).toBe('down');

        // Check fourth KPI (Avg. Order Value)
        expect(kpis[3].label).toBe('Avg. Order Value');
        expect(kpis[3].value).toBe('$124.50');
        expect(kpis[3].trend).toBe(5.7);
        expect(kpis[3].trendDirection).toBe('up');

        done();
      });
    });

    it('should return 12 months of revenue data', (done) => {
      service.getDashboardData().subscribe((data) => {
        const revenue = data.revenueData;

        expect(revenue.length).toBe(12);
        expect(revenue[0].name).toBe('Jan');
        expect(revenue[11].name).toBe('Dec');

        // Check that all months have positive values
        revenue.forEach((month) => {
          expect(month.value).toBeGreaterThan(0);
          expect(typeof month.value).toBe('number');
        });

        done();
      });
    });

    it('should return transactions with valid status values', (done) => {
      service.getDashboardData().subscribe((data) => {
        const transactions = data.recentTransactions;

        transactions.forEach((transaction) => {
          expect(['completed', 'pending', 'failed']).toContain(
            transaction.status
          );
        });

        done();
      });
    });

    it('should return transactions with valid date strings', (done) => {
      service.getDashboardData().subscribe((data) => {
        const transactions = data.recentTransactions;

        transactions.forEach((transaction) => {
          const date = new Date(transaction.date);
          expect(date.toString()).not.toBe('Invalid Date');
          expect(transaction.date).toMatch(/^\d{4}-\d{2}-\d{2}T/); // ISO format
        });

        done();
      });
    });

    it('should return transactions with user objects containing name and avatar', (done) => {
      service.getDashboardData().subscribe((data) => {
        const transactions = data.recentTransactions;

        transactions.forEach((transaction) => {
          expect(transaction.user).toBeDefined();
          expect(typeof transaction.user.name).toBe('string');
          expect(transaction.user.name.length).toBeGreaterThan(0);
          expect(typeof transaction.user.avatar).toBe('string');
          expect(transaction.user.avatar.length).toBeGreaterThan(0);
        });

        done();
      });
    });

    it('should return transactions with amounts in valid range', (done) => {
      service.getDashboardData().subscribe((data) => {
        const transactions = data.recentTransactions;

        transactions.forEach((transaction) => {
          expect(transaction.amount).toBeGreaterThanOrEqual(100);
          expect(transaction.amount).toBeLessThanOrEqual(5100);
        });

        done();
      });
    });

    it('should return transactions sorted by date descending', (done) => {
      service.getDashboardData().subscribe((data) => {
        const transactions = data.recentTransactions;

        for (let i = 0; i < transactions.length - 1; i++) {
          const currentDate = new Date(transactions[i].date);
          const nextDate = new Date(transactions[i + 1].date);
          expect(currentDate.getTime()).toBeGreaterThanOrEqual(
            nextDate.getTime()
          );
        }

        done();
      });
    });
  });
});
