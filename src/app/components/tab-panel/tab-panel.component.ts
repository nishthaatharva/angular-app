import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tab-panel',
  standalone: true,
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
  currentColor = 'black'; // Default color

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  mousedown(event: MouseEvent) {
    this.isDrawing = true;
    this.prevX = event.clientX - this.canvas.nativeElement.offsetLeft;
    this.prevY = event.clientY - this.canvas.nativeElement.offsetTop;
  }

  mouseup() {
    this.isDrawing = false;
  }

  mousemove(event: MouseEvent) {
    if (this.isDrawing) {
      const currentX = event.clientX - this.canvas.nativeElement.offsetLeft;
      const currentY = event.clientY - this.canvas.nativeElement.offsetTop;
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
      this.ctx.strokeStyle = this.currentColor; // Use current color
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
  }

  clearCanvas() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }
  }

  setColor(color: string) {
    this.currentColor = color;
  }
}
