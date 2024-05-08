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
  @ViewChild('stampCanvas', { static: true })
  stampCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('circleStampCanvas', { static: true })
  circleStampCanvas!: ElementRef<HTMLCanvasElement>;
  stampDataURL: string | null = null;

  isDrawing = false;
  prevX = 0;
  prevY = 0;
  ctx: CanvasRenderingContext2D | null = null;
  stampCtx: CanvasRenderingContext2D | null = null;
  currentColor = 'black';
  selectedColor: string = 'black';
  stampColor: string = 'black';
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

  circleTextTop: string = '';
  circleTextCenter: string = '';
  circleTextBottom: string = '';
  circleStampName: string = '';
  circleShowBorder: boolean = false;
  circleStampColor: string = 'black';
  circleStampCtx: CanvasRenderingContext2D | null = null;

  showAdditionalCircle: boolean = false;
  circleStampDataURL: string | null = null;

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.stampCtx = this.stampCanvas.nativeElement.getContext('2d');
    this.redrawStrokes();
    this.updateStamp();
    this.circleStampCtx = this.circleStampCanvas.nativeElement.getContext('2d');
    this.updateCircleStamp();
  }

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  mousedown(event: MouseEvent) {
    if (this.activeTab === 'Canvas') {
      this.isDrawing = true;
      this.prevX = event.clientX - this.canvas.nativeElement.offsetLeft;
      this.prevY = event.clientY - this.canvas.nativeElement.offsetTop;
    }
  }

  mouseup() {
    this.isDrawing = false;
  }

  mousemove(event: MouseEvent) {
    if (this.activeTab === 'Canvas' && this.isDrawing) {
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
    if (this.activeTab === 'Canvas' && this.ctx) {
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
    if (this.activeTab === 'Canvas') {
      this.currentColor = color;
      this.redrawStrokes();
    }
  }

  redrawStrokes() {
    if (this.activeTab === 'Canvas' && this.ctx) {
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
    if (this.activeTab === 'Tab3' && this.stampCtx) {
      const textTop = this.textTop.trim() !== '' ? this.textTop : '';
      const textCenter = this.textCenter.trim() !== '' ? this.textCenter : '';
      const textBottom = this.textBottom.trim() !== '' ? this.textBottom : '';
      const stampName = this.stampName.trim() !== '' ? this.stampName : '';

      const stampColor = this.stampColor;

      this.stampCtx.clearRect(
        0,
        0,
        this.stampCanvas.nativeElement.width,
        this.stampCanvas.nativeElement.height
      );
      this.stampCtx.font = '20px Arial';
      this.stampCtx.fillStyle = stampColor;
      this.stampCtx.strokeStyle = stampColor;
      const canvasWidth = this.stampCanvas.nativeElement.width;
      const canvasHeight = this.stampCanvas.nativeElement.height;
      const x = canvasWidth / 2;
      const y = canvasHeight / 2;

      // Calculate text width for each line
      const textTopWidth = this.stampCtx.measureText(textTop).width;
      const textCenterWidth = this.stampCtx.measureText(textCenter).width;
      const textBottomWidth = this.stampCtx.measureText(textBottom).width;

      if (this.showBorder) {
        // Calculate the border dimensions based on the canvas size
        const borderWidth = canvasWidth - 20;
        const borderHeight = canvasHeight - 20;
        this.stampCtx.strokeRect(10, 10, borderWidth, borderHeight);
      }

      // Adjust x position for each line to center horizontally
      this.stampCtx.fillText(textTop, x - textTopWidth / 2, y - 60);
      this.stampCtx.fillText(textCenter, x - textCenterWidth / 2, y + 6);
      this.stampCtx.fillText(textBottom, x - textBottomWidth / 2, y + 80);
    }
  }

  updateCircleStamp() {
    if (this.circleStampCtx) {
      const textTop = this.circleTextTop.trim() !== '' ? this.circleTextTop : '';
      const textCenter = this.circleTextCenter.trim() !== '' ? this.circleTextCenter : '';
      const stampColor = this.circleStampColor;
  
      // Clear the canvas before redrawing
      this.circleStampCtx.clearRect(
        0,
        0,
        this.circleStampCanvas.nativeElement.width,
        this.circleStampCanvas.nativeElement.height
      );
  
      // Calculate the canvas dimensions
      const canvasWidth = this.circleStampCanvas.nativeElement.width;
      const canvasHeight = this.circleStampCanvas.nativeElement.height;
      const x = canvasWidth / 2;
      const y = canvasHeight / 2;
  
      // Calculate text width for each line
      const textTopWidth = this.circleStampCtx.measureText(textTop).width;
      const textCenterWidth = this.circleStampCtx.measureText(textCenter).width;
  
      // Draw text top outside the condition for additional circle
      this.circleStampCtx.font = '20px Arial';
      this.circleStampCtx.fillStyle = stampColor;
      this.circleStampCtx.textAlign = 'center';
      this.circleStampCtx.textBaseline = 'middle';
      const charCount = textTop.length;
      const charAngle = Math.PI / 25; // Angle between characters
  
      // Calculate the total width of the text
      const totalTextWidth = textTopWidth * charCount;
  
      // Calculate the angle to start writing text to center it along the circle
      const startAngle =
        Math.PI * 1.5 - ((totalTextWidth / (canvasWidth / 2 - 30)) * charAngle) / 2;
  
      for (let i = 0; i < charCount; i++) {
        // Calculate angle for each character position
        const currentAngle = startAngle + i * charAngle;
  
        // Calculate x and y positions for the character
        const xPos = x + (canvasWidth / 2 - 30) * Math.cos(currentAngle);
        const yPos = y + (canvasWidth / 2 - 30) * Math.sin(currentAngle);
  
        // Draw the character
        this.circleStampCtx.save(); // Save the current state of the canvas
        this.circleStampCtx.translate(xPos, yPos); // Translate to the position of the character
        this.circleStampCtx.rotate(currentAngle + Math.PI / 2); // Rotate the canvas
        this.circleStampCtx.fillText(textTop[i], 0, 0); // Draw the character at the translated position
        this.circleStampCtx.restore(); // Restore the canvas to its original state
      }
  
      // Draw additional circle if the checkbox is checked, regardless of whether the outer circle is shown
      if (this.showAdditionalCircle) {
        // Calculate the inner circle radius based on the canvas size
        const innerRadius = Math.min(canvasWidth, canvasHeight) / 2 - 10;
  
        // Draw the additional circle with space between inner and additional circle
        const additionalRadius = (innerRadius / 3) * 2;
        const spaceBetween = innerRadius / 5; // Adjust this value for the desired space
        this.circleStampCtx.beginPath();
        this.circleStampCtx.arc(x, y, additionalRadius, 0, 2 * Math.PI);
        this.circleStampCtx.strokeStyle = stampColor; // Set the stroke color for the additional circle
        this.circleStampCtx.lineWidth = 1;
        this.circleStampCtx.stroke();
      }
  
      // Draw the filled star in the bottom center between the inner and additional circles
      const starSize = 15;
      this.drawStar(
        this.circleStampCtx,
        x,
        canvasHeight - 35,
        starSize,
        5,
        0.5,
        this.circleStampColor
      );
  
      // Draw the outer circle if the checkbox is checked
      if (this.circleShowBorder) {
        // Calculate the outer circle radius based on the canvas size
        const outerRadius = Math.min(canvasWidth, canvasHeight) / 2 - 10;
  
        // Calculate the inner circle radius
        const innerRadius = outerRadius - 3;
  
        // Draw outer circle
        this.circleStampCtx.beginPath();
        this.circleStampCtx.arc(x, y, outerRadius, 0, 2 * Math.PI);
        this.circleStampCtx.strokeStyle = stampColor; // Set the stroke color for the outer circle
        this.circleStampCtx.lineWidth = 1;
        this.circleStampCtx.stroke();
  
        // Draw inner circle with thinner border
        this.circleStampCtx.beginPath();
        this.circleStampCtx.arc(x, y, innerRadius, 0, 2 * Math.PI);
        this.circleStampCtx.strokeStyle = stampColor; // Set the stroke color for the inner circle
        this.circleStampCtx.lineWidth = 1;
        this.circleStampCtx.stroke();
      }
  
      // Draw center text
      this.circleStampCtx.fillText(textCenter, x, y + 6);
    }
  }
  
  // Helper function to draw a star
  drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    points: number,
    inset: number,
    color: string
  ) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 2 * points; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const radius = i % 2 === 0 ? size * inset : size;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
  }

  saveStamp() {
    if (this.stampCanvas) {
      this.stampDataURL = this.stampCanvas.nativeElement.toDataURL('image/png');
    }
  }

  saveCircleStamp() {
    if (this.circleStampCanvas) {
      // Get data URL of the canvas
      this.circleStampDataURL =
        this.circleStampCanvas.nativeElement.toDataURL('image/png');
    }
  }
}
