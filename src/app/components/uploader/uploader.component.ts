import { Component } from '@angular/core';
import { Alert } from 'src/app/classes/alert';
import { AlertType } from 'src/app/enums/alert-type';
import { EditorService } from 'src/app/services/editor.service';
import { GUIService } from 'src/app/services/gui.service';

@Component({
  selector: 'wivae-uploader',
  templateUrl: './uploader.component.html',
})
export class UploaderComponent {
  private _dragging: boolean;

  constructor(private _editor: EditorService, private _gui: GUIService) {
    this._dragging = false;
  }

  private _dumb(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
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

  public handleFile(e?: DragEvent): void {
    this._editor
      .uploadFile(e)
      .then(() => {
        this._gui.clearAlerts();
      })
      .catch((e: string) => {
        this._gui.pushAlert(
          new Alert(AlertType.ERROR, `Cannot open the given file: ${e}`)
        );
      })
      .finally(() => {
        this._dragging = false;
      });
  }
}
