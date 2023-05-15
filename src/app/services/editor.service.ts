import { Injectable } from '@angular/core';
import { EditorStatus } from '../enums/editor-status';
import { Engine } from '../classes/engine';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  private _supported?: boolean;

  private _loading: boolean;

  private _engine?: Engine;

  public constructor() {
    this._loading = false;
  }

  private async _openFile(file?: File): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!(file instanceof File)) {
        reject('Not valid file.');
      } else if (!file.type.startsWith('image/')) {
        reject(`Not valid format\nFile name: ${file.name}`);
      } else {
        this._loading = true;
        this.closeImage();

        const image = new Image();
        image.onerror = () => {
          this._loading = false;
          reject(`Unknown error\nFile name: ${file.name}`);
        };
        image.onload = () => {
          this._engine = new Engine(file, image);
          this._loading = false;
          resolve();
        };
        image.src = URL.createObjectURL(file);
      }
    });
  }

  public get supported(): boolean {
    if (this._supported === undefined) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2');
      this._supported = context !== null;
    }

    return this._supported;
  }

  public get engine(): Engine | undefined {
    return this._engine;
  }

  public get status(): EditorStatus {
    if (!this.supported) return EditorStatus.UNSUPPORTED;
    if (this._loading) return EditorStatus.LOADING;
    return this._engine ? EditorStatus.OPEN : EditorStatus.EMPTY;
  }

  public async openImage(e?: DragEvent): Promise<void> {
    if (e instanceof DragEvent) {
      e.preventDefault();
      e.stopPropagation();
      return this._openFile(e.dataTransfer?.files[0]);
    } else {
      return new Promise<void>((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = () => {
          this._openFile(input.files?.[0])
            .then(resolve)
            .catch((e) => {
              reject(e);
            });
        };
        input.click();
      });
    }
  }

  public closeImage(): void {
    if (this._engine) {
      this._engine.release();
      delete this._engine;
    }
  }
}
