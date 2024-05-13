import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-tab-panel',
  standalone: true,
  imports: [
    FormsModule,
    WebcamModule,
    CommonModule,
    QRCodeModule,
    NgxExtendedPdfViewerModule,
  ],
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
  charCount = 0;
  angleSpace = 0;

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
  fontSize = 20;
  interval = 20;
  shrinking = false;
  myAngularxQrCode: string = '';
  latitude: number | null = null;
  longitude: number | null = null;

  ngOnInit() {
    this.shrinking = false;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.stampCtx = this.stampCanvas.nativeElement.getContext('2d');
    this.redrawStrokes();
    this.updateStamp();
    this.circleStampCtx = this.circleStampCanvas.nativeElement.getContext('2d');
    this.updateCircleStamp();
    this.generateQRCode('https://www.google.com');
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

  setInitial() {
    debugger;
    if (this.textTop == '') {
      this.angleSpace = 0;
      this.fontSize = 20;
      this.interval = 20;
      this.shrinking = false;
    }
  }

  updateCircleStamp() {
    if (this.circleStampCtx) {
      const textTop =
        this.circleTextTop.trim() !== '' ? this.circleTextTop : '';
      if (textTop.length == 0) {
        this.angleSpace = 0;
        this.fontSize = 20;
        this.interval = 20;
        this.shrinking = false;
        this.charCount = 0;
      }
      const textCenter =
        this.circleTextCenter.trim() !== '' ? this.circleTextCenter : '';
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
      const starSize = 15;
      const starRadius = starSize / 2;
      const minDistance = starRadius + 5;
      // Calculate text width for each line
      const textTopWidth = textTop.length;
      const textCenterWidth = this.circleStampCtx.measureText(textCenter).width;

      let increased = false;
      // Draw text top outside the condition for additional circle
      this.circleStampCtx.font = `${this.fontSize}px Arial`;
      this.circleStampCtx.fillStyle = stampColor;
      this.circleStampCtx.textAlign = 'center';
      this.circleStampCtx.textBaseline = 'middle';
      if (this.charCount < textTop.length) {
        increased = true;
      } else if (this.charCount > textTop.length) {
        increased = false;
        if (!this.shrinking) {
          this.interval -= 5;
          this.shrinking = true;
        }
      }
      this.charCount = textTop.length;
      let starOverlapsText = false;
      if (this.interval == this.charCount) {
        starOverlapsText = true;
        if (increased) {
          this.interval += 5;
          this.angleSpace += 5;
          if (this.shrinking) {
            this.shrinking = false;
          }
        } else {
          if (this.interval > 20) {
            this.interval -= 5;
          }
          if (this.angleSpace > 0) {
            this.angleSpace -= 5;
          }
        }
      }
      //const charAngle = Math.PI / 25; // Angle between characters
      const charAngle = (2 * Math.PI) / (25 + this.angleSpace);
      // Calculate the total width of the text
      const totalTextWidth = textTopWidth * 117;
      // Calculate the angle to start writing text to center it along the circle
      const startAngle =
        Math.PI * 1.5 -
        ((totalTextWidth / (canvasWidth / 2 - 30)) * charAngle) / 2;
      // Check if the star overlaps with any character in the text
      for (let i = 0; i < this.charCount; i++) {
        const currentAngle = startAngle + i * charAngle;
        const xPos = x + (canvasWidth / 2 - 30) * Math.cos(currentAngle);
        const yPos = y + (canvasWidth / 2 - 30) * Math.sin(currentAngle);
        const distanceToStar = Math.sqrt(
          (xPos - x) ** 2 + (yPos - (canvasHeight - 35)) ** 2
        );
        if (distanceToStar < minDistance) {
          starOverlapsText = true;
          break;
        }
      }

      // Adjust font size if the star overlaps with the text
      if (starOverlapsText) {
        if (this.fontSize > 12 && increased) {
          this.fontSize = this.fontSize - 1; //Math.max(20 - (textTop.length - 48), 8); // Adjust the minimum font size as needed
        } else if (!increased && this.fontSize <= 20) {
          this.fontSize = this.fontSize + 1;
        }
        this.circleStampCtx.font = `${this.fontSize}px Arial`;
        this.circleStampCtx.letterSpacing = `-1px`;
      } else {
      }
      //  else {
      //   this.circleStampCtx.font = '20px Arial';
      // }
      for (let i = 0; i < this.charCount; i++) {
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
        const additionalRadius =
          (innerRadius / 3) * 2 + 1 + (20 - this.fontSize);
        const spaceBetween = innerRadius / 5; // Adjust this value for the desired space
        this.circleStampCtx.beginPath();
        this.circleStampCtx.arc(x, y, additionalRadius, 0, 2 * Math.PI);
        this.circleStampCtx.strokeStyle = stampColor; // Set the stroke color for the additional circle
        this.circleStampCtx.lineWidth = 1;
        this.circleStampCtx.stroke();
      }
      // Draw the filled star in the bottom center between the inner and additional circles
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
      starOverlapsText = false;
      // If the circle is already filled with text, reduce font size if new text is entered
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
  stream: any = null;
  status: any = null;
  trigger: Subject<void> = new Subject();
  previewImage: string = '';
  btnLabel: string = 'Captured image';

  get $trigger(): Observable<void> {
    return this.trigger.asObservable();
  }
  checkWebcamPermissions() {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 500,
          height: 500,
        },
      })
      .then((res) => {
        console.log('response', res);
        this.stream = res;
        this.status = 'my camera is accessing';
        this.btnLabel = 'Capture Image';
      })
      .catch((err) => {
        console.log(err);
        if (
          err?.message ===
          'The request is not allowed by the user agent or the platform in the current context.'
        ) {
          this.status =
            'Permission denied please try again aprroving the access';
        } else {
          this.status = 'you may not having camera system,please try again...';
        }
      });
  }

  capturedImage() {
    this.trigger.next();
  }

  snapShot(event: WebcamImage) {
    console.log(event);
    this.previewImage = event.imageAsDataUrl;
    this.btnLabel = 'Re Capture Image';
  }

  proceed() {
    console.log(this.previewImage);
  }

  promptLocationPermission() {
    // Check if geolocation is supported by the browser
    if ('geolocation' in navigator) {
      // Request permission for location access
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success callback
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          console.log(
            'Latitude: ' + this.latitude + ', Longitude: ' + this.longitude
          );
          // Do something with the obtained coordinates
        },
        (error) => {
          // Error callback
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.log('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              console.log('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              console.log('The request to get user location timed out.');
              break;
          }
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  generateQRCode(url: string) {
    this.myAngularxQrCode = url;
  }
}
