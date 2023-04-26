import { Injectable } from '@angular/core';
import baseVert from '../shaders/viewer.vert';
import baseFrag from '../shaders/viewer.frag';
import { CoreService } from './core.service';
import { mat4, vec3 } from '../libs/lar';
import { GLSLProgram } from '../classes/glslprogram';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  private static readonly _SQUARE = new Float32Array([
    -1.0, 1.0, 0.0, 1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
    1.0, 0.0,
  ]);

  private static readonly _INDEXES = new Int8Array([0, 1, 2, 3]);

  private static readonly _ZOOM_FACTOR = 1.1;

  private static readonly _MAX_ZOOM = 50;

  private _gl: WebGL2RenderingContext | null;

  private _viewerProgram: GLSLProgram;

  private _bg: vec3;

  private _imageSize: vec3;

  private _position: vec3;

  private _ratio: vec3;

  private _zoom: number;

  private _minZoom: number;

  private _fitted: boolean;

  public constructor(private _core: CoreService) {
    this._gl = null;
    this._viewerProgram = new GLSLProgram(baseVert, baseFrag);
    this._bg = vec3.new(248, 250, 252);
    this._imageSize = vec3.zero();
    this._position = vec3.zero();
    this._ratio = vec3.zero();
    this._zoom = 1;
    this._minZoom = 1;
    this._fitted = true;
  }

  private _updateView(): void {
    const gl = this.gl;

    const view = mat4.translate(
      mat4.scale(mat4.new(1), vec3.scale(this._ratio, this._zoom)),
      this._position,
    );

    gl.uniformMatrix4fv(
      this._viewerProgram.getUniformLocation(gl, 'u_view'),
      false,
      view,
    );
  }

  private _draw(): void {
    const gl = this.gl;

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLE_STRIP, 4, this.gl.UNSIGNED_BYTE, 0);
  }

  public get gl(): WebGL2RenderingContext {
    try {
      this._core.image;
    } catch (e) {
      this._gl = null;
      throw e;
    }

    if (this._gl === null)
      throw new Error('Could not get the WebGL2 rendering context.');

    return this._gl;
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

  public get status(): ReadonlyArray<string> {
    try {
      this.gl;
      return [`Changes: ${0}`, `Zoom: ${(this._zoom * 100).toFixed(2)}%`];
    } catch (e) {
      return ['No image open yet'];
    }
  }

  public setup(canvas: HTMLCanvasElement): void {
    this._gl = canvas.getContext('webgl2');
    const gl = this.gl;
    const image = this._core.image;

    this._fitted = true;
    this._imageSize = vec3.new(image.width, image.height, 1);
    this._position = vec3.zero();

    this._viewerProgram.link(gl);
    this._viewerProgram.use(gl);

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
      gl.STATIC_DRAW,
    );

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(this._viewerProgram.getUniformLocation(gl, 'u_img'), 0);
  }

  public resizeViewport(width: number, height: number): void {
    const gl = this.gl;
    const image = this._core.image;

    const ratioW = image.width / width;
    const ratioH = image.height / height;
    const maxRatio = ratioW > ratioH ? ratioW : ratioH;

    this._ratio = vec3.new(ratioW, ratioH, 0);
    this._minZoom = maxRatio <= 1 ? 1 : 1 / maxRatio;

    if (this._zoom < this._minZoom) this._zoom = this._minZoom;
    if (this._fitted) this._zoom = this._minZoom;

    gl.viewport(0, 0, width, height);
    this._updateView();
    this._draw();
  }

  public translate(movement: vec3): void {
    this._position = vec3.add(
      this._position,
      vec3.div(
        vec3.scale(movement, (2 * devicePixelRatio) / this._zoom),
        this._imageSize,
      ),
    );

    this._updateView();
    this._draw();
  }

  public zoomIn(): void {
    if (!this.canZoomIn) return;

    this._zoom *= EditorService._ZOOM_FACTOR;
    this._fitted = false;
    if (this._zoom > EditorService._MAX_ZOOM) {
      this._zoom = EditorService._MAX_ZOOM;
    }

    this._updateView();
    this._draw();
  }

  public zoomOut(): void {
    if (!this.canZoomOut) return;

    this._zoom /= EditorService._ZOOM_FACTOR;
    if (this._zoom < this._minZoom) {
      this._zoom = this._minZoom;
      this._fitted = true;
    } else {
      this._fitted = false;
    }

    this._updateView();
    this._draw();
  }

  public fit(): void {
    this._zoom = this._minZoom;
    this._fitted = true;
    this._updateView();
    this._draw();
  }

  public realSize(): void {
    this._zoom = 1;
    this._fitted = false;
    this._updateView();
    this._draw();
  }

  public closeImage(): void {
    this._viewerProgram.delete(this.gl);
    this._gl = null;
    this._core.closeFile();
  }
}
