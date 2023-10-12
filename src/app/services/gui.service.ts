import { Injectable } from '@angular/core';
import { Alert } from '../classes/alert';
import { GUI } from '../enums/gui';

@Injectable({
  providedIn: 'root',
})
export class GUIService {
  private _show: Record<GUI, boolean>;

  private _alerts: Readonly<Alert>[];

  public constructor() {
    this._show = {
      [GUI.UNKNOWN]: false,
      [GUI.TOOLBAR]: true,
      [GUI.INVERT]: false,
      [GUI.GRAYSCALE]: false,
      [GUI.GRAYSCALE_MANUAL]: false,
      [GUI.INFOBAR]: true,
      [GUI.SOURCE_FILE]: true,
    };
    this._alerts = [];
  }

  public get show(): Readonly<GUIService['_show']> {
    return this._show;
  }

  public get alerts(): ReadonlyArray<Readonly<Alert>> {
    return this._alerts;
  }

  public closeDialogs(): void {
    this._show[GUI.GRAYSCALE_MANUAL] = false;
  }

  public toggleComponent(component: GUI): void {
    this._show[component] = !this._show[component];
  }

  public pushAlert(alert: Readonly<Alert>): void {
    this._alerts.push(alert);
  }

  public resetAlerts(alert: Readonly<Alert>): void {
    this._alerts = [alert];
  }

  public closeAlert(id: number): void {
    this._alerts = this._alerts.filter((alert) => alert.id !== id);
  }

  public clearAlerts(): void {
    this._alerts = [];
  }
}
