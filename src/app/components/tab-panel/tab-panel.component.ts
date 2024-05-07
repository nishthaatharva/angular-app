import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tab-panel.component.html',
  styleUrls: ['./tab-panel.component.css'],
})
export class TabPanelComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('stampCanvas', { static: true }) stampCanvas!: ElementRef<HTMLCanvasElement>;
  
  isDrawing = false;
  prevX = 0;
  prevY = 0;
  ctx: CanvasRenderingContext2D | null = null;
  stampCtx: CanvasRenderingContext2D | null = null;
  currentColor = 'black';
  selectedColor: string = 'black'; // Color selected for other components
  stampColor: string = 'black'; // Color selected for stamping
  activeTab: string = 'Canvas';
  textInput: string = '';
  fonts: string[] = [
    'Pacifico',
    'Kaushan Script',
    'Dancing Script',
    'Cursive',
    'Shadows Into Light',
    'Sacramento',
    'Satisfy',
  ];
  strokeHistory: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
  }[] = [];
  textTop: string = '';
  textCenter: string = '';
  textBottom: string = '';
  stampName: string = '';
  showBorder: boolean = false;
  
  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.stampCtx = this.stampCanvas.nativeElement.getContext('2d');
    this.redrawStrokes();
    this.updateStamp(); // Initial update when component loads
  }
  
  selectTab(tab: string) {
    this.activeTab = tab;
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
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.strokeHistory.push({
        startX,
        startY,
        endX,
        endY,
        color: this.currentColor,
      });
    }
  }
  
  clearCanvas() {
    if (this.ctx) {
      this.ctx.clearRect(
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height
      );
      this.strokeHistory = [];
      this.currentColor = 'black';
    }
  }
  
  setColor(color: string) {
    this.currentColor = color;
    this.redrawStrokes();
  }
  
  redrawStrokes() {
    if (this.ctx) {
      this.ctx.clearRect(
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height
      );
      for (const line of this.strokeHistory) {
        this.ctx.beginPath();
        this.ctx.moveTo(line.startX, line.startY);
        this.ctx.lineTo(line.endX, line.endY);
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
    }
  }
  
  setColor1(color: string) {
    this.selectedColor = color;
  }
  
  setStampColor(color: string) {
    this.stampColor = color;
    this.updateStamp();
  }
  
  stamp() {
    this.updateStamp();
  }
  
  updateStamp() {
    if (this.stampCtx) {
      const textTop = this.textTop.trim() !== '' ? this.textTop : 'Top';
      const textCenter = this.textCenter.trim() !== '' ? this.textCenter : 'Center';
      const textBottom = this.textBottom.trim() !== '' ? this.textBottom : 'Bottom';
      const stampName = this.stampName.trim() !== '' ? this.stampName : 'Stamp';
      
      // Use separate variable for stamp color
      const stampColor = this.stampColor;
      
      this.stampCtx.clearRect(
        0,
        0,
        this.stampCanvas.nativeElement.width,
        this.stampCanvas.nativeElement.height
      );
      this.stampCtx.font = '20px Arial';
      this.stampCtx.fillStyle = stampColor; // Use stamp color variable
      const textWidth = this.stampCtx.measureText(textTop).width;
      const textHeight = 20; // Assuming font size of 20px
      const canvasWidth = this.stampCanvas.nativeElement.width;
      const canvasHeight = this.stampCanvas.nativeElement.height;
      const x = (canvasWidth - textWidth) / 2;
      const y = (canvasHeight + textHeight) / 2;
      if (this.showBorder) {
        this.stampCtx.strokeRect(
          x - 5,
          y - textHeight - 5,
          textWidth + 10,
          textHeight * 3 + 10
        );
      }
      this.stampCtx.fillText(textTop, x, y - textHeight * 2);
      this.stampCtx.fillText(textCenter, x, y);
      this.stampCtx.fillText(textBottom, x, y + textHeight * 2);
    }
  }
}
