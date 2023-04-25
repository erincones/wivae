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

  public constructor(private _faConfig: FaConfig, public core: CoreService) {
    this._faConfig.fixedWidth = true;
  }
}
