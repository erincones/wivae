import { Component } from '@angular/core';
import { AlertType } from 'src/app/enums/alert-type';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'wivae-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertComponent {
  public constructor(public alerts: AlertsService) {}

  public handleClick(index: number): void {
    this.alerts.close(index);
  }

  public className(type: AlertType): string {
    switch (type) {
      case AlertType.INFORMATION:
        return 'info';
      case AlertType.SUCCESS:
        return 'success';
      case AlertType.WARNING:
        return 'warning';
      case AlertType.ERROR:
        return 'error';
    }
  }
}
