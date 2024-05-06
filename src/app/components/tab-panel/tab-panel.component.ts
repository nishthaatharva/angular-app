import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tab-panel',
  standalone: true, // Make sure this is included
  templateUrl: './tab-panel.component.html',
  styleUrls: ['./tab-panel.component.css']
})
export class TabPanelComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  isDrawing = false;
  prevX = 0;
  prevY = 0;
  ctx: CanvasRenderingContext2D | null = null;

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  mousedown(event: MouseEvent) {
    this.isDrawing = true;
    this.prevX = event.clientX;
    this.prevY = event.clientY;
  }

  mouseup() {
    this.isDrawing = false;
  }

  mousemove(event: MouseEvent) {
    if (this.isDrawing) {
      const currentX = event.clientX;
      const currentY = event.clientY;
      const dx = currentX - this.prevX;
      const dy = currentY - this.prevY;
      this.draw(this.prevX, this.prevY, currentX, currentY);
      this.prevX = currentX;
      this.prevY = currentY;
    }
  }

  draw(startX: number, startY: number, endX: number, endY: number) {
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
  }
}