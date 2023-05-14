import { Injectable } from '@angular/core';
import baseVert from '../shaders/viewer.vert';
import baseFrag from '../shaders/viewer.frag';
import { mat4, vec3 } from '../libs/lar';
import { GLSLProgram } from '../classes/glslprogram';
import { ViewerStatus } from '../enums/viewer-status';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  private static readonly _CONTEXT_ATTRIBUTES: WebGLContextAttributes = {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: true,
    preserveDrawingBuffer: true,
  };

  private static readonly _SQUARE: Float32Array = new Float32Array([
    -1.0, 1.0, 0.0, 0.0, -1.0, -1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, -1.0,
    1.0, 1.0,
  ]);

  private static readonly _INDEXES: Int8Array = new Int8Array([0, 1, 2, 3]);

  private static readonly _ZOOM_FACTOR: number = 1.1;

  private static readonly _MAX_ZOOM: number = 50;

  private _supported?: boolean;

  private _file?: File;

  private _image?: HTMLImageElement;

  private _loading: boolean;

  private _gl: WebGL2RenderingContext | null;

  private _program: Record<'viewer', GLSLProgram>;

  private _bg: vec3;

  private _canvasSize: vec3;

  private _imageSize: vec3;

  private _position: vec3;

  private _ratio: vec3;

  private _zoom: number;

  private _minZoom: number;

  private _fitted: boolean;

  public constructor() {
    this._loading = false;
    this._gl = null;
    this._program = { viewer: new GLSLProgram(baseVert, baseFrag) };
    this._bg = vec3.new(248, 250, 252);
    this._canvasSize = vec3.zero();
    this._imageSize = vec3.zero();
    this._position = vec3.zero();
    this._ratio = vec3.zero();
    this._zoom = 1;
    this._minZoom = 1;
    this._fitted = true;
  }

  private async _openFile(file?: File): Promise<void> {
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
          this._file = file;
          this._image = image;
          this._loading = false;
          resolve();
        };
        image.src = URL.createObjectURL(file);
      }
    });
  }

  private _project(point: vec3): vec3 {
    return vec3.div(
      vec3.scale(point, (2 * devicePixelRatio) / this._zoom),
      this._imageSize
    );
  }

  private _translatePosition(translation: vec3): boolean {
    const offset = vec3.div(
      vec3.scale(
        vec3.sub(vec3.scale(this._imageSize, this._zoom), this._canvasSize),
        1 / this._zoom
      ),
      this._imageSize
    );

    const position = vec3.add(this._position, translation);
    const delta = vec3.abs(position);
    const offX = offset[0];
    const offY = offset[1];

    if (offX <= 0) position[0] = 0;
    else if (delta[0] > offX) position[0] = position[0] > 0 ? offX : -offX;

    if (offY <= 0) position[1] = 0;
    else if (delta[1] > offY) position[1] = position[1] > 0 ? offY : -offY;

    if (!vec3.equals(this._position, position)) {
      this._position = position;
      return true;
    }

    return false;
  }

  private _updateZoom(factor: number, origin = vec3.zero()): void {
    let zoom = this._zoom * factor;

    if (zoom > EditorService._MAX_ZOOM) zoom = EditorService._MAX_ZOOM;
    else if (zoom < this._minZoom) zoom = this._minZoom;

    if (zoom !== this._zoom) {
      const source = this._project(origin);
      this._zoom = zoom;
      this._fitted = this._zoom === this._minZoom;

      this._translatePosition(vec3.sub(source, this._project(origin)));
      this._updateView();
    }
  }

  private _updateView(): void {
    const gl = this.gl;

    const view = mat4.translate(
      mat4.scale(mat4.new(1), vec3.scale(this._ratio, this._zoom)),
      this._position
    );

    gl.uniformMatrix4fv(
      this._program.viewer.getUniformLocation(gl, 'u_view'),
      false,
      view
    );

    this._draw();
  }

  private _draw(): void {
    const gl = this.gl;

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLE_STRIP, 4, this.gl.UNSIGNED_BYTE, 0);
  }

  public get supported(): boolean {
    if (this._supported === undefined) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2');
      this._supported = context !== null;
    }

    return this._supported;
  }

  public get file(): File {
    if (!(this._file instanceof File)) throw new Error('Not image file set.');

    return this._file;
  }

  public get image(): HTMLImageElement {
    if (!(this._image instanceof HTMLImageElement))
      throw new Error('Not image set.');

    return this._image;
  }

  public get gl(): WebGL2RenderingContext {
    try {
      this.image;
    } catch (e) {
      this._gl = null;
      throw e;
    }

    if (this._gl === null)
      throw new Error('Could not get the WebGL2 rendering context.');

    return this._gl;
  }

  public get bg(): vec3 {
    return this._bg;
  }

  public set bg(bg: vec3) {
    this._bg = vec3.new(...bg);
    this.gl.clearColor(...vec3.scale(this._bg, 1 / 255), 1);
    this._draw();
  }

  public get zoom(): number {
    return this._zoom;
  }

  public get canZoomIn(): boolean {
    return this._zoom < EditorService._MAX_ZOOM;
  }

  public get canZoomOut(): boolean {
    return this._zoom > this._minZoom;
  }

  public get fitted(): boolean {
    return this._fitted;
  }

  public get realSized(): boolean {
    return this._zoom === 1;
  }

  public get status(): ViewerStatus {
    if (!this.supported) return ViewerStatus.UNSUPPORTED;
    if (this._loading) return ViewerStatus.LOADING;
    return this._image === undefined ? ViewerStatus.EMPTY : ViewerStatus.OPEN;
  }

  public get summary(): ReadonlyArray<string> {
    try {
      this.gl;
      return [`Changes: ${0}`, `Zoom: ${(this._zoom * 100).toFixed(2)}%`];
    } catch (e) {
      return ['No image open yet'];
    }
  }

  public setup(canvas: HTMLCanvasElement): void {
    this._gl = canvas.getContext('webgl2', EditorService._CONTEXT_ATTRIBUTES);
    const gl = this.gl;
    const image = this.image;

    this._canvasSize = vec3.zero();
    this._imageSize = vec3.new(image.width, image.height, 1);
    this._position = vec3.zero();
    this._ratio = vec3.zero();
    this._zoom = 1;
    this._minZoom = 1;
    this._fitted = true;

    this._program.viewer.link(gl);
    this._program.viewer.use(gl);

    gl.clearColor(...vec3.scale(this._bg, 1 / 255), 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, EditorService._SQUARE, gl.STATIC_DRAW);

    const ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      EditorService._INDEXES,
      gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );

    gl.uniform1i(this._program.viewer.getUniformLocation(gl, 'u_img'), 0);
  }

  public resizeViewport(width: number, height: number): void {
    const canvasSize = vec3.new(width, height, 0);
    if (vec3.equals(this._canvasSize, canvasSize)) return;

    const gl = this.gl;
    const image = this.image;

    const ratioW = image.width / width;
    const ratioH = image.height / height;
    const maxRatio = ratioW > ratioH ? ratioW : ratioH;

    this._ratio = vec3.new(ratioW, ratioH, 0);
    this._canvasSize = canvasSize;
    this._minZoom = maxRatio <= 1 ? 1 : 1 / maxRatio;

    if (this._zoom < this._minZoom) this._zoom = this._minZoom;
    if (this._fitted) this._zoom = this._minZoom;

    gl.viewport(0, 0, width, height);
    this._updateView();
  }

  public translate(movement: vec3): void {
    if (this._translatePosition(this._project(movement))) this._updateView();
  }

  public zoomIn(origin?: vec3): void {
    if (this.canZoomIn) {
      this._updateZoom(EditorService._ZOOM_FACTOR, origin);
    }
  }

  public zoomOut(origin?: vec3): void {
    if (this.canZoomOut) {
      this._updateZoom(1 / EditorService._ZOOM_FACTOR, origin);
    }
  }

  public fit(): void {
    if (this._zoom !== this._minZoom) {
      this._updateZoom(this._minZoom / this._zoom);
    }
  }

  public realSize(): void {
    if (this._zoom !== 1) this._updateZoom(1 / this._zoom);
  }

  public async uploadFile(e?: DragEvent): Promise<void> {
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

  public saveImage(): void {
    const gl = this.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    const canvasSize = this._canvasSize;
    const position = this._position;
    const zoom = this._zoom;

    canvas.width = this._imageSize[0];
    canvas.height = this._imageSize[1];
    this._position = vec3.zero();
    this._zoom = 1;
    this.resizeViewport(canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob === null) return;

      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);

      a.href = url;
      a.download = `WIVAE-${Date.now()}`;
      a.click();

      URL.revokeObjectURL(url);
    });

    canvas.width = canvasSize[0];
    canvas.height = canvasSize[1];
    this._position = position;
    this._zoom = zoom;
    this.resizeViewport(canvasSize[0], canvasSize[1]);
  }

  public closeImage(): void {
    this.closeFile();
    if (this._gl !== null) {
      this._program.viewer.delete(this._gl);
      this._gl = null;
    }
  }

  public closeFile(): void {
    if (this._file !== undefined) delete this._file;

    if (this._image !== undefined) {
      URL.revokeObjectURL(this._image.src);
      delete this._image;
    }
  }
}
