import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Transaction, TransactionStatus } from '@core/models';

type SortColumn = 'user' | 'date' | 'amount' | 'status';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  column: SortColumn;
  direction: SortDirection;
}

@Component({
  selector: 'app-transactions-table',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-slate-200">
      <!-- Header with Search -->
      <div class="p-6 border-b border-slate-200">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Recent Transactions</h2>
            <p class="text-sm text-slate-600 mt-1">
              {{ filteredAndSortedTransactions().length }} total transactions
            </p>
          </div>
          
          <!-- Search Input -->
          <div class="relative">
            <input
              type="text"
              [ngModel]="searchQuery()"
              (ngModelChange)="onSearchChange($event)"
              placeholder="Search by user or status..."
              class="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
            />
            <svg
              class="absolute left-3 top-2.5 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th
                (click)="onSort('user')"
                class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div class="flex items-center space-x-1">
                  <span>User</span>
                  @if (sortConfig().column === 'user') {
                    <svg
                      class="w-4 h-4"
                      [class.rotate-180]="sortConfig().direction === 'desc'"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  }
                </div>
              </th>
              <th
                (click)="onSort('date')"
                class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div class="flex items-center space-x-1">
                  <span>Date</span>
                  @if (sortConfig().column === 'date') {
                    <svg
                      class="w-4 h-4"
                      [class.rotate-180]="sortConfig().direction === 'desc'"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  }
                </div>
              </th>
              <th
                (click)="onSort('amount')"
                class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div class="flex items-center space-x-1">
                  <span>Amount</span>
                  @if (sortConfig().column === 'amount') {
                    <svg
                      class="w-4 h-4"
                      [class.rotate-180]="sortConfig().direction === 'desc'"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  }
                </div>
              </th>
              <th
                (click)="onSort('status')"
                class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div class="flex items-center space-x-1">
                  <span>Status</span>
                  @if (sortConfig().column === 'status') {
                    <svg
                      class="w-4 h-4"
                      [class.rotate-180]="sortConfig().direction === 'desc'"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  }
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            @for (transaction of paginatedTransactions(); track transaction.id) {
              <tr class="hover:bg-slate-50 transition-colors">
                <!-- User -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm"
                    >
                      {{ transaction.user.avatar }}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-slate-900">
                        {{ transaction.user.name }}
                      </div>
                      <div class="text-sm text-slate-500">{{ transaction.id }}</div>
                    </div>
                  </div>
                </td>

                <!-- Date -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-slate-900">
                    {{ formatDate(transaction.date) }}
                  </div>
                  <div class="text-sm text-slate-500">
                    {{ formatTime(transaction.date) }}
                  </div>
                </td>

                <!-- Amount -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-slate-900">
                    {{ '$' + transaction.amount.toLocaleString() }}
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    [class]="
                      'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ' +
                      getStatusClass(transaction.status)
                    "
                  >
                    {{ transaction.status }}
                  </span>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <svg
                      class="w-12 h-12 text-slate-300 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p class="text-slate-500 font-medium">No transactions found</p>
                    <p class="text-slate-400 text-sm mt-1">
                      Try adjusting your search criteria
                    </p>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (totalPages() > 1) {
        <div class="px-6 py-4 border-t border-slate-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-slate-600">
              Showing {{ (currentPage() - 1) * pageSize() + 1 }} to
              {{ Math.min(currentPage() * pageSize(), filteredAndSortedTransactions().length) }}
              of {{ filteredAndSortedTransactions().length }} results
            </div>

            <div class="flex items-center space-x-2">
              <!-- Previous Button -->
              <button
                type="button"
                (click)="onPageChange(currentPage() - 1)"
                [disabled]="currentPage() === 1"
                class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <!-- Page Numbers -->
              @for (page of getPageNumbers(); track page) {
                <button
                  type="button"
                  (click)="onPageChange(page)"
                  [class]="
                    'px-3 py-2 border rounded-lg text-sm font-medium transition-colors ' +
                    (page === currentPage()
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50')
                  "
                >
                  {{ page }}
                </button>
              }

              <!-- Next Button -->
              <button
                type="button"
                (click)="onPageChange(currentPage() + 1)"
                [disabled]="currentPage() === totalPages()"
                class="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsTableComponent {
  // Input
  readonly transactions = input.required<Transaction[]>();

  // Internal State Signals
  protected readonly searchQuery = signal<string>('');
  protected readonly sortConfig = signal<SortConfig>({
    column: 'date',
    direction: 'desc',
  });
  protected readonly currentPage = signal<number>(1);
  protected readonly pageSize = signal<number>(10);

  // Expose Math for template
  protected readonly Math = Math;

  // COMPUTED SIGNAL 1: Filter and Sort
  protected readonly filteredAndSortedTransactions = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const config = this.sortConfig();
    let result = [...this.transactions()];

    // Filter by search query
    if (query) {
      result = result.filter(
        (t) =>
          t.user.name.toLowerCase().includes(query) ||
          t.status.toLowerCase().includes(query) ||
          t.id.toLowerCase().includes(query)
      );
    }

    // Sort by column
    result.sort((a, b) => {
      let comparison = 0;

      switch (config.column) {
        case 'user':
          comparison = a.user.name.localeCompare(b.user.name);
          break;
        case 'date':
          comparison =
            new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return config.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  });

  // COMPUTED SIGNAL 2: Paginate
  protected readonly paginatedTransactions = computed(() => {
    const filtered = this.filteredAndSortedTransactions();
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  // COMPUTED SIGNAL 3: Total Pages
  protected readonly totalPages = computed(() => {
    const total = this.filteredAndSortedTransactions().length;
    return Math.ceil(total / this.pageSize());
  });

  // Event Handlers
  protected onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1); // Reset to first page
  }

  protected onSort(column: SortColumn): void {
    const current = this.sortConfig();
    if (current.column === column) {
      // Toggle direction
      this.sortConfig.set({
        column,
        direction: current.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      // New column, default to ascending
      this.sortConfig.set({ column, direction: 'asc' });
    }
  }

  protected onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // Utility Methods
  protected getStatusClass(status: TransactionStatus): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
    }
  }

  protected formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  protected formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  protected getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    // Show max 5 page numbers
    let start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);

    // Adjust start if we're near the end
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
