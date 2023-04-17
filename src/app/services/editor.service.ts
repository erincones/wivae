import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  private _gl: WebGL2RenderingContext | null;

  public constructor() {
    this._gl = null;
  }

  public setup(canvas: HTMLCanvasElement) {
    this._gl = canvas.getContext('webgl2');
  }
}
