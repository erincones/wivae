import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'wivae-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent {
  public readonly faChevronDown: IconDefinition;

  public readonly faChevronUp: IconDefinition;

  @Input()
  public name: string;

  @Input()
  public open: boolean;

  public constructor() {
    this.faChevronDown = faChevronDown;
    this.faChevronUp = faChevronUp;
    this.open = false;
    this.name = '';
  }
}
