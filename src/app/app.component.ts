import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabPanelComponent } from './components/tab-panel/tab-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TabPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-app';
}
