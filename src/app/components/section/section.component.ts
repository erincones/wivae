import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { GUI } from 'src/app/enums/gui';
import { GUIService } from 'src/app/services/gui.service';

@Component({
  selector: 'wivae-section',
  templateUrl: './section.component.html',
})
export class SectionComponent {
  public readonly faChevronDown: IconDefinition;

  public readonly faChevronUp: IconDefinition;

  @Input()
  public name: string;

  @Input({ required: true })
  public component: GUI;

  public constructor(public gui: GUIService) {
    this.faChevronDown = faChevronDown;
    this.faChevronUp = faChevronUp;
    this.name = '';
    this.component = GUI.UNKNOWN;
  }

  public toggle(): void {
    this.gui.toggleComponent(this.component);
  }
}
