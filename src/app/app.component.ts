import { Component } from '@angular/core';
import { FaConfig } from '@fortawesome/angular-fontawesome';
import { CoreService } from './services/core.service';
import { ViewerStatus } from './enums/viewer-status';

@Component({
  selector: '[wivae-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public readonly ViewerStatus = ViewerStatus;

  public constructor(private _faConfig: FaConfig, private _core: CoreService) {
    this._faConfig.fixedWidth = true;
  }

  public get viewerStatus(): ViewerStatus {
    return this._core.viewerStatus;
  }

  public get showToolbar(): boolean {
    return this._core.showToolbar;
  }

  public get showInfobar(): boolean {
    return this._core.showInfobar;
  }
}
