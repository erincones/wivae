import { Injectable } from '@angular/core';
import { AlertType } from '../enums/alert-type';
import { Alert } from '../classes/alert';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  private _alerts: Alert[];

  public constructor() {
    this._alerts = [];
  }

  public get alerts(): ReadonlyArray<Alert> {
    return this._alerts;
  }

  public push(type: AlertType, text: string): void {
    this._alerts.push(new Alert(type, text));
  }

  public reset(type: AlertType, text: string): void {
    this._alerts = [new Alert(type, text)];
  }

  public close(id: number): void {
    this._alerts = this._alerts.filter((alert) => alert.id !== id);
  }

  public clear(): void {
    this._alerts = [];
  }
}
