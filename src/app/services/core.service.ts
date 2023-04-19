import { Injectable } from '@angular/core';
import { ViewerStatus } from '../enums/viewer-status';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private _supported?: boolean;

  private _image?: HTMLImageElement;

  public get supported(): boolean {
    if (this._supported === undefined) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2');
      this._supported = context !== null;
    }

    return this._supported;
  }

  public get viewerStatus(): ViewerStatus {
    if (!this.supported) return ViewerStatus.UNSUPPORTED;
    return this._image === undefined ? ViewerStatus.EMPTY : ViewerStatus.OPEN;
  }

  public get image(): HTMLImageElement {
    if (!(this._image instanceof HTMLImageElement))
      throw new Error('Not image set.');

    return this._image;
  }

  public async openFile(file: File): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(`Not valid format\nFile name: ${file.name}`);
      } else {
        if (this._image !== undefined) URL.revokeObjectURL(this._image.src);
        const image = new Image();
        image.onerror = () => {
          reject(`Unknown error\nFile name: ${file.name}`);
        };
        image.onload = () => {
          this._image = image;
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
}
