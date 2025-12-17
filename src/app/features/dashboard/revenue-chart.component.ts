import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnChanges,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueData } from '@core/models';

@Component({
  selector: 'app-revenue-chart',
  imports: [CommonModule],
  template: `
    @if (isLoading()) {
      <!-- Skeleton Loader -->
      <div class="animate-pulse">
        <div class="h-64 bg-slate-200 rounded-lg"></div>
      </div>
    } @else {
      <div class="relative">
        <canvas #chartCanvas class="w-full" style="height: 300px"></canvas>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevenueChartComponent implements AfterViewInit, OnChanges {
  readonly data = input<RevenueData[]>([]);
  private readonly chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.renderChart();
    }
  }

  protected isLoading(): boolean {
    return !this.data() || this.data().length === 0;
  }

  private renderChart(): void {
    const canvas = this.chartCanvas()?.nativeElement;
    if (!canvas || this.isLoading()) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const data = this.data();
    const width = canvas.offsetWidth;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Chart dimensions
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Find max value for scaling
    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const valueRange = maxValue - minValue;

    // Calculate points
    const points: { x: number; y: number }[] = data.map((item, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const normalizedValue = (item.value - minValue) / valueRange;
      const y = padding + chartHeight - normalizedValue * chartHeight;
      return { x, y };
    });

    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    points.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw line
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();

    // Draw points
    points.forEach((point) => {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Draw labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';

    data.forEach((item, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      ctx.fillText(item.name, x, height - padding + 20);
    });

    // Draw value labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (valueRange / 5) * (5 - i);
      const y = padding + (chartHeight / 5) * i;
      ctx.fillText(`$${(value / 1000).toFixed(0)}k`, padding - 10, y + 4);
    }
  }
}
