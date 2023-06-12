import { Component } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCaretLeft,
  faCaretRight,
  faInfo,
  faPenRuler,
} from '@fortawesome/free-solid-svg-icons';
import { GUI } from 'src/app/enums/gui';
import { EditorService } from 'src/app/services/editor.service';
import { GUIService } from 'src/app/services/gui.service';

@Component({
  selector: 'wivae-statusbar',
  templateUrl: './statusbar.component.html',
})
export class StatusbarComponent {
  public readonly faCaretLeft: IconDefinition;
  public readonly faCaretRight: IconDefinition;
  public readonly faPenRuler: IconDefinition;
  public readonly faInfo: IconDefinition;

  public constructor(private _gui: GUIService, public editor: EditorService) {
    this.faCaretLeft = faCaretLeft;
    this.faCaretRight = faCaretRight;
    this.faPenRuler = faPenRuler;
    this.faInfo = faInfo;
  }

  public get showToolbar(): boolean {
    return this._gui.show[GUI.TOOLBAR];
  }

  public get showInfobar(): boolean {
    return this._gui.show[GUI.INFOBAR];
  }

  public toggleToolbar(): void {
    this._gui.toggleComponent(GUI.TOOLBAR);
  }

  public toggleInfobar(): void {
    this._gui.toggleComponent(GUI.INFOBAR);
  }
}
