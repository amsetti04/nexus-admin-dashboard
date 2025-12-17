import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { DashboardService } from '@core/services';
import { KpiCardComponent } from '@shared/components';
import { RevenueChartComponent } from './revenue-chart.component';
import { TransactionsTableComponent } from './transactions-table.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    KpiCardComponent,
    RevenueChartComponent,
    TransactionsTableComponent,
  ],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p class="text-slate-600 mt-1">Welcome back! Here's your overview.</p>
        </div>
        <button
          type="button"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
        >
          Export Report
        </button>
      </div>

      @if (dashboardData(); as data) {
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (metric of data.kpiMetrics; track metric.label) {
            <app-kpi-card
              [title]="metric.label"
              [value]="metric.value"
              [trend]="metric.trend"
              [trendDirection]="metric.trendDirection"
              [icon]="metric.icon"
              [bgColor]="metric.bgColor"
            />
          }
        </div>

        <!-- Revenue Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-slate-900">Revenue Overview</h2>
            <div class="flex items-center space-x-2 text-sm text-slate-600">
              <span class="w-3 h-3 bg-indigo-500 rounded-full"></span>
              <span>Monthly Revenue</span>
            </div>
          </div>
          <app-revenue-chart [data]="data.revenueData" />
        </div>

        <!-- Transactions Table -->
        <app-transactions-table [transactions]="data.recentTransactions" />
      } @else if (error()) {
        <!-- Error State -->
        <div class="bg-red-50 border border-red-200 rounded-xl p-6">
          <div class="flex items-center space-x-3">
            <svg
              class="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 class="text-red-900 font-semibold">Failed to load dashboard data</h3>
              <p class="text-red-700 text-sm mt-1">{{ error() }}</p>
            </div>
          </div>
        </div>
      } @else {
        <!-- Loading State -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (i of [1, 2, 3, 4]; track i) {
            <app-kpi-card />
          }
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div class="h-4 bg-slate-200 rounded w-32 mb-6 animate-pulse"></div>
          <div class="h-64 bg-slate-200 rounded-lg animate-pulse"></div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);

  // Convert Observable to Signal using toSignal
  // This automatically handles subscription and cleanup
  protected readonly dashboardData = toSignal(
    this.dashboardService.getDashboardData(),
    { initialValue: undefined }
  );

  // Error signal (placeholder for future error handling)
  protected readonly error = toSignal(
    this.dashboardService.getDashboardData(),
    { initialValue: undefined }
  );
}
