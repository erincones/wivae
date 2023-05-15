import { Component } from '@angular/core';
import { FaConfig } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { EditorStatus } from './enums/editor-status';
import { EditorService } from './services/editor.service';
import { GUIService } from './services/gui.service';

@Component({
  selector: 'wivae-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public readonly EditorStatus = EditorStatus;

  public readonly faCircleNotch: IconDefinition;

  public constructor(
    private _faConfig: FaConfig,
    public editor: EditorService,
    public gui: GUIService
  ) {
    this._faConfig.fixedWidth = true;
    this.faCircleNotch = faCircleNotch;
  }
}
