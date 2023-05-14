import { Injectable } from '@angular/core';
import { Alert } from '../classes/alert';

@Injectable({
  providedIn: 'root',
})
export class GUIService {
  private _showToolbar: boolean;

  private _showInfobar: boolean;

  private _alerts: Readonly<Alert>[];

  public constructor() {
    this._showToolbar = true;
    this._showInfobar = true;
    this._alerts = [];
  }

  public get showToolbar(): boolean {
    return this._showToolbar;
  }

  public get showInfobar(): boolean {
    return this._showInfobar;
  }

  public get alerts(): ReadonlyArray<Readonly<Alert>> {
    return this._alerts;
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

  public toggleToolbar(): void {
    this._showToolbar = !this._showToolbar;
  }

  public toggleInfobar(): void {
    this._showInfobar = !this._showInfobar;
  }
}
