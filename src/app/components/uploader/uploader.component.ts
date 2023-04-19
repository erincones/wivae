import { Component } from '@angular/core';
import { AlertType } from 'src/app/enums/alert-type';
import { CoreService } from 'src/app/services/core.service';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: '[wivae-uploader]',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent {
  private _dragging: boolean;

  constructor(private _core: CoreService, private _alerts: AlertsService) {
    this._dragging = false;
  }

  private _dumb(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
  }

  private _upload(file?: File): void {
    if (!(file instanceof File)) {
      this._alerts.push(
        AlertType.ERROR,
        'Cannot open the given file: Not valid file.',
      );
    } else {
      this._core
        .openFile(file)
        .then(() => {
          this._alerts.clear();
        })
        .catch((e: string) => {
          this._alerts.push(
            AlertType.ERROR,
            `Cannot open the given file: ${e}`,
          );
        });
    }
  }

  public get dragging(): boolean {
    return this._dragging;
  }

  public handleDrag(e: DragEvent): void {
    this._dumb(e);
    this._dragging = true;
  }

  public handleDragLeave(e: DragEvent): void {
    this._dumb(e);
    this._dragging = false;
  }

  public handleDrop(e: DragEvent): void {
    this.handleDragLeave(e);
    this._upload(e.dataTransfer?.files[0]);
  }

  public handleClick(e: MouseEvent): void {
    this._dumb(e);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      this._upload(input.files?.[0]);
    };
    input.click();
  }
}
