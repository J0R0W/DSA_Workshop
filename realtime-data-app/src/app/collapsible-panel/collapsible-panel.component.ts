import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-collapsible-panel',
  templateUrl: './collapsible-panel.component.html',
  styleUrls: ['./collapsible-panel.component.css']
})
export class CollapsiblePanelComponent {
  @Input() title: string = '';
  isOpen: boolean = false;

  get toggleIcon(): string {
    return this.isOpen ? '−' : '+'; // '−' is an en dash, not a hyphen
  }

  togglePanel() {
    this.isOpen = !this.isOpen;
    const panelContent = document.querySelector('.panel-content');
    if (panelContent) {
      if (this.isOpen) {
        panelContent.classList.add('open');
      } else {
        panelContent.classList.remove('open');
      }
    }
  }
}
