import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabPanelComponent } from './components/tab-panel/tab-panel.component';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { DocumentEditorComponent } from './components/document-editor/document-editor.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TabPanelComponent,
    DocumentEditorComponent,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-app';
}
