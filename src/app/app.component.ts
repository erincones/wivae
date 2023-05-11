import { Component } from '@angular/core';
import { FaConfig } from '@fortawesome/angular-fontawesome';
import { CoreService } from './services/core.service';
import { ViewerStatus } from './enums/viewer-status';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'wivae-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public readonly ViewerStatus = ViewerStatus;

  public readonly faCircleNotch: IconDefinition;

  public constructor(private _faConfig: FaConfig, public core: CoreService) {
    this._faConfig.fixedWidth = true;
    this.faCircleNotch = faCircleNotch;
  }
}
