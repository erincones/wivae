import { Component } from '@angular/core';
import { AlertType } from 'src/app/enums/alert-type';
import { GUIService } from 'src/app/services/gui.service';

@Component({
  selector: 'wivae-alerts',
  templateUrl: './alerts.component.html',
})
export class AlertComponent {
  public constructor(public gui: GUIService) {}

  public handleClick(index: number): void {
    this.gui.closeAlert(index);
  }

  public className(type: AlertType): string {
    switch (type) {
      case AlertType.INFORMATION:
        return 'border-blue-500 bg-blue-100 text-blue-900';
      case AlertType.SUCCESS:
        return 'border-green-500 bg-green-100 text-green-900';
      case AlertType.WARNING:
        return 'border-yellow-500 bg-yellow-100 text-yellow-900';
      case AlertType.ERROR:
        return 'border-red-500 bg-red-100 text-red-900';
    }
  }
}
