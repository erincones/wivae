import { Component } from '@angular/core';
import { FaConfig } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { EditorStatus } from './enums/editor-status';
import { EditorService } from './services/editor.service';
import { GUIService } from './services/gui.service';
import { GUI } from './enums/gui';

@Component({
  selector: 'wivae-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public readonly EditorStatus = EditorStatus;

  public readonly faCircleNotch: IconDefinition;

  public constructor(
    private _faConfig: FaConfig,
    private _gui: GUIService,
    public editor: EditorService
  ) {
    this._faConfig.fixedWidth = true;
    this.faCircleNotch = faCircleNotch;
  }

  public get showToolbar(): boolean {
    return this._gui.show[GUI.TOOLBAR];
  }

  public get showInfobar(): boolean {
    return this._gui.show[GUI.INFOBAR];
  }
}
