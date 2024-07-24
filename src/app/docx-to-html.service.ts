import { Injectable } from '@angular/core';
import * as mammoth from 'mammoth';

@Injectable({
  providedIn: 'root',
})
export class DocxToHtmlService {
  constructor() {}

  public async convertDocxToHtml(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const result = await mammoth.convertToHtml({ arrayBuffer }, {
            styleMap: [
              "u => u",
              "b => b",
              "i => i",
              "strike => s",
              "center => div.center",
              "highlight => mark",
              "r[style-name='Highlight'] => mark",
              "p[style-name='Normal'] => p:fresh",
              "p[style-name='Heading 1'] => h1:fresh",
              "p[style-name='Heading 2'] => h2:fresh",
              "p[style-name='Heading 3'] => h3:fresh",
              "p[style-name='List Paragraph'] => li",
              "p[style-name='Title'] => h1:fresh",
              "p[style-name='Subtitle'] => h2:fresh",
              "p[style-name='Heading 4'] => h4:fresh",
              "p[style-name='Heading 5'] => h5:fresh",
              "p[style-name='Heading 6'] => h6:fresh",
            ]
          });
          const htmlContent = this.processHtml(result.value);
          resolve(htmlContent);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private processHtml(html: string): string {
    return html
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;') // Replace tabs with 4 non-breaking spaces
      .replace(/  /g, '&nbsp;&nbsp;') // Replace double spaces with non-breaking spaces
      .replace(/\n/g, '<br>') // Replace new lines with <br>
      .replace(/<mark([^>]*)>/g, (match, p1) => {
        const color = this.extractHighlightColor(match);
        return `<mark${p1} style="background-color: ${color};">`;
      });
  }

  private extractHighlightColor(markTag: string): string {
    const colorRegex = /highlight-\w+/;
    const match = markTag.match(colorRegex);
    return match ? match[0].split('-')[1] : 'yellow';
  }
}
