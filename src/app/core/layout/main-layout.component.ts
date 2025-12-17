import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="flex h-screen bg-slate-50 overflow-hidden">
      <!-- Sidebar -->
      <app-sidebar
        [isOpen]="isSidebarOpen()"
        (closeSidebar)="closeSidebar()"
      />

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <app-header (toggleSidebar)="toggleSidebar()" />

        <!-- Content -->
        <main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  // Signal for sidebar state management
  protected readonly isSidebarOpen = signal(false);

  protected toggleSidebar(): void {
    this.isSidebarOpen.update((value) => !value);
  }

  protected closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
