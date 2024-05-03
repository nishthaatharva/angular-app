import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Tab {
  title: string;
  content: string;
}

@Component({
  selector: 'app-tab-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-panel.component.html',
  styleUrl: './tab-panel.component.css'
})
export class TabPanelComponent {
  tabs: Tab[] = [
    { title: 'Tab 1', content: 'Content for Tab 1' },
    { title: 'Tab 2', content: 'Content for Tab 2' },
    { title: 'Tab 3', content: 'Content for Tab 3' }
  ];
  activeTab: Tab = this.tabs[0];
  selectTab(tab: Tab) {
    this.activeTab = tab;
  }
}
