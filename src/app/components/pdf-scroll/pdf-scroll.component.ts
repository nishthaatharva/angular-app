import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pdf-scroll',
  standalone: true,
  imports: [],
  templateUrl: './pdf-scroll.component.html',
  styleUrl: './pdf-scroll.component.scss',
})
export class PdfScrollComponent {
  @ViewChild('rightPanel', { static: true }) rightPanel!: ElementRef;
  images: string[] = [
    'https://wallpapercave.com/fwp-510/wp13948108.jpg',
    'https://wallpapercave.com/fwp-510/wp9396786.jpg',
    'https://wallpapercave.com/fwp-510/wp8903600.jpg',
    'https://wallpapercave.com/fwp-510/wp4535640.jpg',
    'https://wallpapercave.com/fwp-510/wp13944050.jpg',
    'https://wallpapercave.com/fuwp-510/uwp4380463.jpeg',
    'https://wallpapercave.com/fuwp-510/uwp4380480.jpeg',
    'https://wallpapercave.com/pwp-400/wp13945612.jpg',
  ];
  selectedImageIndex: number | null = null;
  translateY: number = 0;

  showImage(index: number) {
    this.selectedImageIndex = index;
    const imageHeight = 300;
    const panelHeight = 400;

    // Scroll the right panel to the selected image
    const scrollPosition =
      index * imageHeight - panelHeight / 2 + imageHeight / 2;
    this.rightPanel.nativeElement.scrollTop = scrollPosition;
  }
}
