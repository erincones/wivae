import { Injectable } from '@angular/core';
import { ViewerStatus } from '../enums/viewer-status';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private _supported?: boolean;

  private _image?: HTMLImageElement;

  private _loading: boolean;

  private _showToolbar: boolean;

  private _showInfobar: boolean;

  public constructor() {
    this._loading = false;
    this._showToolbar = true;
    this._showInfobar = true;
  }

  public get supported(): boolean {
    if (this._supported === undefined) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2');
      this._supported = context !== null;
    }

    return this._supported;
  }

  public get status(): ViewerStatus {
    if (!this.supported) return ViewerStatus.UNSUPPORTED;
    if (this._loading) return ViewerStatus.LOADING;
    return this._image === undefined ? ViewerStatus.EMPTY : ViewerStatus.OPEN;
  }

  public get image(): HTMLImageElement {
    if (!(this._image instanceof HTMLImageElement))
      throw new Error('Not image set.');

    return this._image;
  }

  public get showToolbar(): boolean {
    return this._showToolbar;
  }

  public get showInfobar(): boolean {
    return this._showInfobar;
  }

  public async uploadFile(e?: DragEvent): Promise<void> {
    if (e instanceof DragEvent) {
      e.preventDefault();
      e.stopPropagation();
      return this.openFile(e.dataTransfer?.files[0]);
    } else {
      return new Promise<void>((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = () => {
          this.openFile(input.files?.[0])
            .then(resolve)
            .catch((e) => {
              reject(e);
            });
        };
        input.click();
      });
    }
  }

  public async openFile(file?: File): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!(file instanceof File)) {
        reject('Not valid file.');
      } else if (!file.type.startsWith('image/')) {
        reject(`Not valid format\nFile name: ${file.name}`);
      } else {
        this._loading = true;
        if (this._image !== undefined) this.closeFile();

        const image = new Image();
        image.onerror = () => {
          this._loading = false;
          reject(`Unknown error\nFile name: ${file.name}`);
        };
        image.onload = () => {
          this._image = image;
          this._loading = false;
          resolve();
        };
        image.src = URL.createObjectURL(file);
      }
    });
  }

  public closeFile(): void {
    if (this._image !== undefined) {
      URL.revokeObjectURL(this._image.src);
      delete this._image;
    }
  }

  public toggleToolbar(): void {
    this._showToolbar = !this._showToolbar;
  }

  public toggleInfobar(): void {
    this._showInfobar = !this._showInfobar;
  }
}
