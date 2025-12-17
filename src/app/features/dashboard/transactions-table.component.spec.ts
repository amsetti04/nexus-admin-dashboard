import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsTableComponent } from './transactions-table.component';
import { Transaction } from '@core/models';
import { ComponentRef } from '@angular/core';

describe('TransactionsTableComponent', () => {
  let component: TransactionsTableComponent;
  let fixture: ComponentFixture<TransactionsTableComponent>;
  let componentRef: ComponentRef<TransactionsTableComponent>;

  // Mock transaction data
  const mockTransactions: Transaction[] = Array.from({ length: 25 }, (_, i) => ({
    id: `TXN-${String(i + 1).padStart(4, '0')}`,
    user: {
      name: `User ${i + 1}`,
      avatar: `U${i + 1}`,
    },
    date: new Date(2025, 11, 9 - i).toISOString(),
    amount: 1000 + i * 100,
    status: i % 3 === 0 ? 'completed' : i % 3 === 1 ? 'pending' : 'failed',
  }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsTableComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    // Set input signal
    componentRef.setInput('transactions', mockTransactions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Pagination', () => {
    it('should display 10 transactions by default (page size)', () => {
      const paginated = component['paginatedTransactions']();
      expect(paginated.length).toBe(10);
    });

    it('should display first 10 transactions on page 1', () => {
      const paginated = component['paginatedTransactions']();
      expect(paginated[0].id).toBe('TXN-0001');
      expect(paginated[9].id).toBe('TXN-0010');
    });

    it('should update paginated transactions when currentPage changes to 2', () => {
      // Change to page 2
      component['currentPage'].set(2);
      fixture.detectChanges();

      const paginated = component['paginatedTransactions']();
      expect(paginated.length).toBe(10);
      expect(paginated[0].id).toBe('TXN-0011');
      expect(paginated[9].id).toBe('TXN-0020');
    });

    it('should update paginated transactions when currentPage changes to 3', () => {
      // Change to page 3
      component['currentPage'].set(3);
      fixture.detectChanges();

      const paginated = component['paginatedTransactions']();
      expect(paginated.length).toBe(5); // Only 5 items left (25 total)
      expect(paginated[0].id).toBe('TXN-0021');
      expect(paginated[4].id).toBe('TXN-0025');
    });

    it('should calculate total pages correctly', () => {
      const totalPages = component['totalPages']();
      expect(totalPages).toBe(3); // 25 items / 10 per page = 3 pages
    });

    it('should handle page changes via onPageChange method', () => {
      component['onPageChange'](2);
      expect(component['currentPage']()).toBe(2);

      const paginated = component['paginatedTransactions']();
      expect(paginated[0].id).toBe('TXN-0011');
    });

    it('should not change page if page number is out of bounds', () => {
      component['onPageChange'](99);
      expect(component['currentPage']()).toBe(1); // Should stay on page 1

      component['onPageChange'](0);
      expect(component['currentPage']()).toBe(1); // Should stay on page 1
    });
  });

  describe('Filtering', () => {
    it('should filter transactions by status "completed"', () => {
      component['searchQuery'].set('completed');
      fixture.detectChanges();

      const filtered = component['filteredAndSortedTransactions']();
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((transaction) => {
        expect(transaction.status).toBe('completed');
      });
    });

    it('should filter transactions by status "pending"', () => {
      component['searchQuery'].set('pending');
      fixture.detectChanges();

      const filtered = component['filteredAndSortedTransactions']();
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((transaction) => {
        expect(transaction.status).toBe('pending');
      });
    });

    it('should filter transactions by status "failed"', () => {
      component['searchQuery'].set('failed');
      fixture.detectChanges();

      const filtered = component['filteredAndSortedTransactions']();
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((transaction) => {
        expect(transaction.status).toBe('failed');
      });
    });

    it('should filter transactions by user name', () => {
      component['searchQuery'].set('User 5');
      fixture.detectChanges();

      const filtered = component['filteredAndSortedTransactions']();
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((transaction) => {
        expect(transaction.user.name.toLowerCase()).toContain('user 5');
      });
    });

    it('should be case-insensitive when filtering', () => {
      component['searchQuery'].set('COMPLETED');
      fixture.detectChanges();

      const filtered = component['filteredAndSortedTransactions']();
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((transaction) => {
        expect(transaction.status).toBe('completed');
      });
    });

    it('should return all transactions when search query is empty', () => {
      component['searchQuery'].set('');
      fixture.detectChanges();

      const filtered = component['filteredAndSortedTransactions']();
      expect(filtered.length).toBe(25);
    });

    it('should reset to page 1 when search query changes', () => {
      component['currentPage'].set(2);
      component['onSearchChange']('completed');

      expect(component['currentPage']()).toBe(1);
    });

    it('should filter by transaction ID', () => {
      component['searchQuery'].set('TXN-0005');
      fixture.detectChanges();

      const filtered = component['filteredAndSortedTransactions']();
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('TXN-0005');
    });
  });

  describe('Sorting', () => {
    it('should sort by user name ascending', () => {
      component['onSort']('user');
      fixture.detectChanges();

      const sorted = component['filteredAndSortedTransactions']();
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(
          sorted[i].user.name.localeCompare(sorted[i + 1].user.name)
        ).toBeLessThanOrEqual(0);
      }
    });

    it('should toggle sort direction when clicking same column', () => {
      // First click - ascending
      component['onSort']('user');
      expect(component['sortConfig']().direction).toBe('asc');

      // Second click - descending
      component['onSort']('user');
      expect(component['sortConfig']().direction).toBe('desc');

      // Third click - ascending again
      component['onSort']('user');
      expect(component['sortConfig']().direction).toBe('asc');
    });

    it('should sort by amount ascending', () => {
      component['onSort']('amount');
      fixture.detectChanges();

      const sorted = component['filteredAndSortedTransactions']();
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].amount).toBeLessThanOrEqual(sorted[i + 1].amount);
      }
    });

    it('should sort by amount descending', () => {
      component['onSort']('amount');
      component['onSort']('amount'); // Toggle to descending
      fixture.detectChanges();

      const sorted = component['filteredAndSortedTransactions']();
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].amount).toBeGreaterThanOrEqual(sorted[i + 1].amount);
      }
    });

    it('should sort by date ascending', () => {
      component['onSort']('date');
      fixture.detectChanges();

      const sorted = component['filteredAndSortedTransactions']();
      for (let i = 0; i < sorted.length - 1; i++) {
        const date1 = new Date(sorted[i].date).getTime();
        const date2 = new Date(sorted[i + 1].date).getTime();
        expect(date1).toBeLessThanOrEqual(date2);
      }
    });

    it('should sort by status ascending', () => {
      component['onSort']('status');
      fixture.detectChanges();

      const sorted = component['filteredAndSortedTransactions']();
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(
          sorted[i].status.localeCompare(sorted[i + 1].status)
        ).toBeLessThanOrEqual(0);
      }
    });

    it('should default to ascending when sorting new column', () => {
      component['onSort']('user');
      component['onSort']('user'); // Toggle to desc
      expect(component['sortConfig']().direction).toBe('desc');

      // Sort by different column
      component['onSort']('amount');
      expect(component['sortConfig']().direction).toBe('asc');
    });
  });

  describe('Combined Filtering and Sorting', () => {
    it('should filter and then sort correctly', () => {
      component['searchQuery'].set('completed');
      component['onSort']('amount');
      fixture.detectChanges();

      const result = component['filteredAndSortedTransactions']();

      // All should be completed
      result.forEach((transaction) => {
        expect(transaction.status).toBe('completed');
      });

      // Should be sorted by amount ascending
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].amount).toBeLessThanOrEqual(result[i + 1].amount);
      }
    });

    it('should paginate filtered and sorted results', () => {
      component['searchQuery'].set('completed');
      component['onSort']('amount');
      component['currentPage'].set(1);
      fixture.detectChanges();

      const paginated = component['paginatedTransactions']();
      expect(paginated.length).toBeLessThanOrEqual(10);

      // All should be completed
      paginated.forEach((transaction) => {
        expect(transaction.status).toBe('completed');
      });
    });
  });

  describe('Utility Methods', () => {
    it('should return correct status class for completed', () => {
      const statusClass = component['getStatusClass']('completed');
      expect(statusClass).toBe('bg-green-100 text-green-800');
    });

    it('should return correct status class for pending', () => {
      const statusClass = component['getStatusClass']('pending');
      expect(statusClass).toBe('bg-yellow-100 text-yellow-800');
    });

    it('should return correct status class for failed', () => {
      const statusClass = component['getStatusClass']('failed');
      expect(statusClass).toBe('bg-red-100 text-red-800');
    });

    it('should format date correctly', () => {
      const isoDate = '2025-12-09T12:00:00.000Z';
      const formatted = component['formatDate'](isoDate);
      expect(formatted).toMatch(/Dec 9, 2025/);
    });

    it('should format time correctly', () => {
      const isoDate = '2025-12-09T14:30:00.000Z';
      const formatted = component['formatTime'](isoDate);
      expect(formatted).toMatch(/\d{1,2}:\d{2}\s[AP]M/);
    });

    it('should generate correct page numbers', () => {
      component['currentPage'].set(1);
      const pages = component['getPageNumbers']();
      expect(pages).toEqual([1, 2, 3]);
    });

    it('should generate correct page numbers for middle page', () => {
      component['currentPage'].set(2);
      const pages = component['getPageNumbers']();
      expect(pages).toEqual([1, 2, 3]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty transactions array', () => {
      componentRef.setInput('transactions', []);
      fixture.detectChanges();

      const filtered = component['filteredAndSortedTransactions']();
      expect(filtered.length).toBe(0);

      const paginated = component['paginatedTransactions']();
      expect(paginated.length).toBe(0);

      const totalPages = component['totalPages']();
      expect(totalPages).toBe(0);
    });

    it('should handle search with no results', () => {
      component['searchQuery'].set('nonexistent');
      fixture.detectChanges();

      const filtered = component['filteredAndSortedTransactions']();
      expect(filtered.length).toBe(0);

      const paginated = component['paginatedTransactions']();
      expect(paginated.length).toBe(0);
    });

    it('should handle single transaction', () => {
      componentRef.setInput('transactions', [mockTransactions[0]]);
      fixture.detectChanges();

      const paginated = component['paginatedTransactions']();
      expect(paginated.length).toBe(1);

      const totalPages = component['totalPages']();
      expect(totalPages).toBe(1);
    });
  });
});
