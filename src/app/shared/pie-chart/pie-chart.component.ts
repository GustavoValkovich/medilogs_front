import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnChanges {
  @Input() data: Array<{ label: string; value: number; color?: string }> = [];

  total = 0;
  arcs: Array<{ label: string; value: number; color: string; startAngle: number; endAngle: number; percent: number }> = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  get showLegend(): boolean {
    return this.arcs && this.arcs.some(a => (a.label || '').toString().trim().length > 0);
  }

  render(): void {
    this.total = this.data.reduce((s, d) => s + (d.value || 0), 0);
    let start = 0;
    this.arcs = this.data.map(d => {
      const value = d.value || 0;
      const angle = this.total ? (value / this.total) * 360 : 0;
      const arc = { label: d.label, value, color: d.color || '#888', startAngle: start, endAngle: start + angle, percent: this.total ? Math.round((value / this.total) * 100) : 0 };
      start += angle;
      return arc;
    });
  }
  // Convert angles to SVG path for an arc in a circle of radius r centered at cx,cy
  arcPath(startAngle: number, endAngle: number, r = 80, cx = 100, cy = 100): string {
    // if the arc is a full circle, draw a circle element instead (handled in template)
    const start = this.polarToCartesian(startAngle, r, cx, cy);
    const end = this.polarToCartesian(endAngle, r, cx, cy);
    const largeArcFlag = (endAngle - startAngle) <= 180 ? '0' : '1';
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
  }

  polarToCartesian(angle: number, r: number, cx: number, cy: number) {
    const a = (angle - 90) * Math.PI / 180.0;
    return { x: cx + (r * Math.cos(a)), y: cy + (r * Math.sin(a)) };
  }
}
