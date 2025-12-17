import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  template: `
    <header class="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div class="flex items-center justify-between px-4 py-3 md:px-6">
        <!-- Mobile Menu Button -->
        <button
          type="button"
          (click)="toggleSidebar.emit()"
          class="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg
            class="w-6 h-6 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <!-- Logo/Title -->
        <div class="flex items-center space-x-3">
          <div class="hidden md:flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg"></div>
            <h1 class="text-xl font-bold text-slate-800">SaaS Analytics</h1>
          </div>
          <h1 class="md:hidden text-lg font-bold text-slate-800">Dashboard</h1>
        </div>

        <!-- Right Section -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button
            type="button"
            class="p-2 rounded-lg hover:bg-slate-100 transition-colors relative"
            aria-label="Notifications"
          >
            <svg
              class="w-6 h-6 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span
              class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
            ></span>
          </button>

          <!-- User Profile -->
          <div class="flex items-center space-x-3">
            <div class="hidden sm:block text-right">
              <p class="text-sm font-medium text-slate-700">John Doe</p>
              <p class="text-xs text-slate-500">Admin</p>
            </div>
            <div
              class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold"
            >
              JD
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly toggleSidebar = output<void>();
}
