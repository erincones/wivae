import { AlertType } from '../enums/alert-type';

export class Alert {
  private static _count = 0;

  private readonly _id: number;

  private readonly _type: AlertType;

  private readonly _text: string;

  public constructor(type: AlertType, text: string) {
    this._id = Alert._count++;
    this._type = type;
    this._text = text;
  }

  public get id(): number {
    return this._id;
  }

  public get type(): AlertType {
    return this._type;
  }

  public get text(): string {
    return this._text;
  }
}
