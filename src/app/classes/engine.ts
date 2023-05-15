import { Program } from '../enums/program';
import { mat4, vec2, vec3 } from '../libs/lar';
import { ProgramCollection } from './program-collection';

export class Engine {
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

  private _gl!: WebGL2RenderingContext;

  private _program!: ProgramCollection;

  private _canvas!: HTMLCanvasElement;

  private _image: HTMLImageElement;

  private _file: File;

  private _history: undefined;

  private _canvasSize: vec2;

  private _imageSize: vec2;

  private _ratio: vec2;

  private _bg: vec3;

  private _position: vec2;

  private _zoom: number;

  private _minZoom: number;

  private _fitted: boolean;

  public constructor(file: File, image: HTMLImageElement) {
    this._image = image;
    this._file = file;
    this._history = undefined;
    this._imageSize = vec2.new(this._image.width, this._image.height);
    this._canvasSize = vec2.zero();
    this._ratio = vec2.zero();
    this._bg = vec3.new(248, 250, 252);
    this._position = vec2.zero();
    this._zoom = 1;
    this._minZoom = 1;
    this._fitted = true;
  }

  private _project(point: vec2): vec2 {
    return vec2.div(
      vec2.scale(point, (2 * devicePixelRatio) / this._zoom),
      this._imageSize
    );
  }

  private _translatePosition(translation: vec2): boolean {
    const offset = vec2.div(
      vec2.scale(
        vec2.sub(vec2.scale(this._imageSize, this._zoom), this._canvasSize),
        1 / this._zoom
      ),
      this._imageSize
    );

    const position = vec2.add(this._position, translation);
    const delta = vec2.abs(position);
    const offX = offset[0];
    const offY = offset[1];

    if (offX <= 0) position[0] = 0;
    else if (delta[0] > offX) position[0] = position[0] > 0 ? offX : -offX;

    if (offY <= 0) position[1] = 0;
    else if (delta[1] > offY) position[1] = position[1] > 0 ? offY : -offY;

    if (!vec2.equals(this._position, position)) {
      this._position = position;
      return true;
    }

    return false;
  }

  private _updateZoom(factor: number, origin = vec2.zero()): void {
    let zoom = this._zoom * factor;

    if (zoom > Engine._MAX_ZOOM) zoom = Engine._MAX_ZOOM;
    else if (zoom < this._minZoom) zoom = this._minZoom;

    if (zoom !== this._zoom) {
      const source = this._project(origin);
      this._zoom = zoom;
      this._fitted = this._zoom === this._minZoom;

      this._translatePosition(vec2.sub(source, this._project(origin)));
      this._updateView();
    }
  }

  private _updateView(): void {
    this._gl.uniformMatrix4fv(
      this._program.getUniformLocation('u_view'),
      false,
      mat4.translate(
        mat4.scale(mat4.new(1), vec2.scale(this._ratio, this._zoom)),
        this._position
      )
    );

    this._draw();
  }

  private _draw(): void {
    this._gl.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT);
    this._gl.drawElements(
      WebGL2RenderingContext.TRIANGLE_STRIP,
      4,
      WebGL2RenderingContext.UNSIGNED_BYTE,
      0
    );
  }

  public get bg(): vec3 {
    return this._bg;
  }

  public set bg(bg: vec3) {
    this._bg = vec3.new(...bg);
    this._gl.clearColor(...vec3.scale(this._bg, 1 / 255), 1);
    this._draw();
  }

  public get zoom(): number {
    return this._zoom;
  }

  public get canZoomIn(): boolean {
    return this._zoom < Engine._MAX_ZOOM;
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

  public get summary(): ReadonlyArray<string> {
    return [`Changes: ${0}`, `Zoom: ${(this._zoom * 100).toFixed(2)}%`];
  }

  public setup(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._gl = this._canvas.getContext(
      'webgl2',
      Engine._CONTEXT_ATTRIBUTES
    ) as WebGL2RenderingContext;
    this._program = new ProgramCollection(this._gl);

    this._gl.clearColor(...vec3.scale(this._bg, 1 / 255), 1);
    this._gl.enable(this._gl.BLEND);
    this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);

    const vao = this._gl.createVertexArray();
    this._gl.bindVertexArray(vao);

    const vbo = this._gl.createBuffer();
    this._gl.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, vbo);
    this._gl.bufferData(
      WebGL2RenderingContext.ARRAY_BUFFER,
      Engine._SQUARE,
      WebGL2RenderingContext.STATIC_DRAW
    );

    const ebo = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, ebo);
    this._gl.bufferData(
      WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER,
      Engine._INDEXES,
      WebGL2RenderingContext.STATIC_DRAW
    );

    this._gl.enableVertexAttribArray(0);
    this._gl.vertexAttribPointer(0, 2, this._gl.FLOAT, false, 16, 0);

    this._gl.enableVertexAttribArray(1);
    this._gl.vertexAttribPointer(1, 2, this._gl.FLOAT, false, 16, 8);

    const texture = this._gl.createTexture();
    this._gl.activeTexture(this._gl.TEXTURE0);
    this._gl.bindTexture(this._gl.TEXTURE_2D, texture);

    this._gl.pixelStorei(WebGL2RenderingContext.UNPACK_FLIP_Y_WEBGL, true);
    this._gl.texImage2D(
      WebGL2RenderingContext.TEXTURE_2D,
      0,
      WebGL2RenderingContext.RGBA,
      WebGL2RenderingContext.RGBA,
      WebGL2RenderingContext.UNSIGNED_BYTE,
      this._image
    );

    this._gl.generateMipmap(WebGL2RenderingContext.TEXTURE_2D);
    this._gl.texParameteri(
      WebGL2RenderingContext.TEXTURE_2D,
      WebGL2RenderingContext.TEXTURE_WRAP_S,
      WebGL2RenderingContext.CLAMP_TO_EDGE
    );
    this._gl.texParameteri(
      WebGL2RenderingContext.TEXTURE_2D,
      WebGL2RenderingContext.TEXTURE_WRAP_T,
      WebGL2RenderingContext.CLAMP_TO_EDGE
    );
    this._gl.texParameteri(
      WebGL2RenderingContext.TEXTURE_2D,
      WebGL2RenderingContext.TEXTURE_MAG_FILTER,
      WebGL2RenderingContext.NEAREST
    );
    this._gl.texParameteri(
      this._gl.TEXTURE_2D,
      this._gl.TEXTURE_MIN_FILTER,
      this._gl.LINEAR_MIPMAP_LINEAR
    );

    this._program.use(Program.VIEWER);
    this._gl.uniform1i(this._program.getUniformLocation('u_img'), 0);
  }

  public resizeViewport(): void {
    const canvasSize = vec2.new(this._canvas.width, this._canvas.height);
    if (vec2.equals(this._canvasSize, canvasSize)) return;

    this._canvasSize = canvasSize;
    this._ratio = vec2.div(this._imageSize, this._canvasSize);
    const maxRatio = vec2.max(this._ratio);
    this._minZoom = maxRatio <= 1 ? 1 : 1 / maxRatio;

    if (this._zoom < this._minZoom) this._zoom = this._minZoom;
    if (this._fitted) this._zoom = this._minZoom;

    this._gl.viewport(0, 0, this._canvasSize[0], this._canvasSize[1]);
    this._updateView();
  }

  public translate(movement: vec2): void {
    if (this._translatePosition(this._project(movement))) this._updateView();
  }

  public zoomIn(origin?: vec2): void {
    if (this.canZoomIn) {
      this._updateZoom(Engine._ZOOM_FACTOR, origin);
    }
  }

  public zoomOut(origin?: vec2): void {
    if (this.canZoomOut) {
      this._updateZoom(1 / Engine._ZOOM_FACTOR, origin);
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

  public saveImage(): void {
    const canvasSize = this._canvasSize;
    const position = this._position;
    const zoom = this._zoom;

    this._canvas.width = this._imageSize[0];
    this._canvas.height = this._imageSize[1];
    this._position = vec2.zero();
    this._zoom = 1;
    this.resizeViewport();

    this._canvas.toBlob((blob) => {
      if (blob === null) return;

      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);

      a.href = url;
      a.download = `WIVAE-${Date.now()}`;
      a.click();

      URL.revokeObjectURL(url);
    });

    this._canvas.width = canvasSize[0];
    this._canvas.height = canvasSize[1];
    this._position = position;
    this._zoom = zoom;
    this.resizeViewport();
  }

  public release(): void {
    this._program.release();
  }
}
