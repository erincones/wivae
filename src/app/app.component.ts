import { Component } from '@angular/core';
import { CoreService } from './services/core.service';
import { ViewerStatus } from './enums/viewer-status';

@Component({
  selector: '[wivae-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public readonly ViewerStatus = ViewerStatus;

  public constructor(public core: CoreService) {}
}
