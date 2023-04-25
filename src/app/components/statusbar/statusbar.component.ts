import { Component } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCaretLeft,
  faCaretRight,
  faInfo,
  faPenRuler,
} from '@fortawesome/free-solid-svg-icons';
import { CoreService } from 'src/app/services/core.service';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: '[wivae-statusbar]',
  templateUrl: './statusbar.component.html',
  styleUrls: ['./statusbar.component.scss'],
})
export class StatusbarComponent {
  public readonly faCaretLeft: IconDefinition;
  public readonly faCaretRight: IconDefinition;
  public readonly faPenRuler: IconDefinition;
  public readonly faInfo: IconDefinition;

  public constructor(public core: CoreService, public editor: EditorService) {
    this.faCaretLeft = faCaretLeft;
    this.faCaretRight = faCaretRight;
    this.faPenRuler = faPenRuler;
    this.faInfo = faInfo;
  }
}
