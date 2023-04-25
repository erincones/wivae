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

  public constructor(
    private _core: CoreService,
    private _editor: EditorService,
  ) {
    this.faCaretLeft = faCaretLeft;
    this.faCaretRight = faCaretRight;
    this.faPenRuler = faPenRuler;
    this.faInfo = faInfo;
  }

  public get showToolbar(): boolean {
    return this._core.showToolbar;
  }

  public get showInfobar(): boolean {
    return this._core.showInfobar;
  }

  public get status(): string {
    return this._editor.status;
  }

  public toggleToolBar(): void {
    this._core.toggleToolbar();
  }

  public toggleInfoBar(): void {
    this._core.toggleInfobar();
  }
}
