import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendDirection } from '@core/models';

@Component({
  selector: 'app-kpi-card',
  imports: [CommonModule],
  template: `
    @if (isLoading()) {
      <!-- Skeleton Loader -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="h-4 bg-slate-200 rounded w-24 mb-3"></div>
            <div class="h-8 bg-slate-200 rounded w-32"></div>
          </div>
          <div class="w-12 h-12 bg-slate-200 rounded-lg"></div>
        </div>
        <div class="mt-4">
          <div class="h-4 bg-slate-200 rounded w-28"></div>
        </div>
      </div>
    } @else {
      <!-- Actual Card -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600 font-medium">{{ title() }}</p>
            <p class="text-2xl font-bold text-slate-900 mt-2">{{ value() }}</p>
          </div>
          @if (icon() && bgColor()) {
            <div
              [class]="
                'w-12 h-12 rounded-lg flex items-center justify-center ' +
                bgColor()
              "
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  [attr.d]="icon()"
                />
              </svg>
            </div>
          }
        </div>
        @if (trend() !== null && trend() !== undefined) {
          <div class="mt-4 flex items-center">
            <!-- Trend Arrow -->
            <svg
              [class]="
                'w-4 h-4 mr-1 ' +
                (trendDirection() === 'up' ? 'text-green-600' : 'text-red-600')
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              @if (trendDirection() === 'up') {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              } @else {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              }
            </svg>
            <span
              [class]="
                'text-sm font-medium ' +
                (trendDirection() === 'up' ? 'text-green-600' : 'text-red-600')
              "
            >
              {{ trendDirection() === 'up' ? '+' : '-' }}{{ Math.abs(trend()!) }}%
            </span>
            <span class="text-sm text-slate-600 ml-2">vs last month</span>
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardComponent {
  readonly title = input<string>();
  readonly value = input<string>();
  readonly trend = input<number | null>();
  readonly trendDirection = input<TrendDirection>('up');
  readonly icon = input<string>();
  readonly bgColor = input<string>();

  // Expose Math for template
  protected readonly Math = Math;

  protected isLoading(): boolean {
    return (
      this.title() === undefined ||
      this.value() === undefined ||
      this.title() === null ||
      this.value() === null
    );
  }
}
