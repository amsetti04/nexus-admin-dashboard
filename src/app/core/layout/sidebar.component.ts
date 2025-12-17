import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Mobile Overlay -->
    @if (isOpen()) {
      <div
        class="fixed inset-0 bg-slate-900/50 z-20 md:hidden"
        (click)="closeSidebar.emit()"
      ></div>
    }

    <!-- Sidebar -->
    <aside
      [class]="
        'fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col ' +
        (isOpen() ? 'translate-x-0' : '-translate-x-full')
      "
    >
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg"></div>
          <h2 class="text-lg font-bold text-white">SaaS Analytics</h2>
        </div>
        <button
          type="button"
          (click)="closeSidebar.emit()"
          class="md:hidden p-1 rounded hover:bg-slate-800 transition-colors"
          aria-label="Close sidebar"
        >
          <svg
            class="w-6 h-6 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        @for (item of navItems; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="bg-indigo-600 text-white"
            [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
            class="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors group"
            (click)="onNavItemClick()"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                [attr.d]="item.icon"
              />
            </svg>
            <span class="font-medium">{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Sidebar Footer -->
      <div class="px-4 py-4 border-t border-slate-800">
        <div class="flex items-center space-x-3 px-4 py-3">
          <svg
            class="w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span class="text-sm text-slate-400">Settings</span>
        </div>
      </div>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly isOpen = input.required<boolean>();
  readonly closeSidebar = output<void>();

  protected readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
      label: 'Analytics',
      path: '/analytics',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    },
    {
      label: 'Customers',
      path: '/customers',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    },
  ];

  protected onNavItemClick(): void {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      this.closeSidebar.emit();
    }
  }
}
