import { Effect } from '../enums/effect';
import { Grayscale } from '../enums/grayscale';
import { Uniform } from '../enums/uniform';
import { mat4, vec2, vec3 } from '../libs/lar';
import { EffectData, EffectStack } from './effect-stack';
import { ProgramsCollection } from './programs-collection';

export class Engine {
  private static readonly _CONTEXT_ATTRIBUTES: WebGLContextAttributes = {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: true,
    preserveDrawingBuffer: true,
  };

  private static readonly _SQUARE: Float32Array = new Float32Array([
    -1.0, 1.0, 0.0, 1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
    1.0, 0.0,
  ]);

  private static readonly _INDEXES: Int8Array = new Int8Array([0, 1, 2, 3]);

  private static readonly _ZOOM_FACTOR: number = 1.1;

  private static readonly _MAX_ZOOM: number = 50;

  private _gl!: WebGL2RenderingContext;

  private _program!: ProgramsCollection;

  private _effect!: EffectStack;

  private _canvas!: HTMLCanvasElement;

  private _image: HTMLImageElement;

  private _file: File;

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
    this._imageSize = vec2.new(this._image.width, this._image.height);
    this._canvasSize = vec2.zero();
    this._ratio = vec2.zero();
    this._bg = vec3.new(248, 250, 252);
    this._position = vec2.zero();
    this._zoom = 1;
    this._minZoom = 1;
    this._fitted = true;
  }

  private _projectPoint(point: vec2): vec2 {
    return vec2.div(
      vec2.scale(point, (2 * devicePixelRatio) / this._zoom),
      this._imageSize
    );
  }

  private _translatePosition(translation: vec2): vec2 {
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

    return position;
  }

  private _updateView(): void {
    this._program.use(Effect.VIEWER);
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

  private _drawEffect(data: EffectData): void {
    this._program.use(data.effect);

    if (data.params)
      Object.entries(data.params).forEach(([name, param]) => {
        switch (param.type) {
          case Uniform.FLOAT:
            this._gl.uniform1f(
              this._program.getUniformLocation(name),
              param.value
            );
            break;
          case Uniform.FLOAT_VEC3:
            this._gl.uniform3fv(
              this._program.getUniformLocation(name),
              param.value
            );
            break;
          case Uniform.FLOAT_MAT4:
            this._gl.uniformMatrix4fv(
              this._program.getUniformLocation(name),
              false,
              param.value
            );
            break;
          case Uniform.FLOAT_ARRAY:
            this._gl.uniform1fv(
              this._program.getUniformLocation(name),
              param.value
            );
            break;
        }
      });

    this._gl.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT);
    this._gl.drawElements(
      WebGL2RenderingContext.TRIANGLE_STRIP,
      4,
      WebGL2RenderingContext.UNSIGNED_BYTE,
      0
    );
  }

  private _draw(): void {
    this._effect.traverse(
      this._imageSize,
      this._canvasSize,
      this._drawEffect.bind(this)
    );
    this._drawEffect({ effect: Effect.VIEWER });
  }

  public get file(): File {
    return this._file;
  }

  public get history(): Readonly<EffectStack> {
    return this._effect;
  }

  public set bg(bg: vec3) {
    this._bg = vec3.new(...bg);
    this._gl.clearColor(...vec3.scale(this._bg, 1 / 255), 1);
    this._draw();
  }

  public get bg(): vec3 {
    return this._bg;
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

  public setup(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._gl = this._canvas.getContext(
      'webgl2',
      Engine._CONTEXT_ATTRIBUTES
    ) as WebGL2RenderingContext;
    this._program = new ProgramsCollection(this._gl);

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

    this._effect = new EffectStack(this._gl, this._image);

    this._program.use(Effect.VIEWER);
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
    const position = this._translatePosition(this._projectPoint(movement));

    if (!vec2.equals(position, this._position)) {
      this._position = position;
      this._updateView();
    }
  }

  public setZoom(zoom: number, target = vec2.zero()): void {
    if (zoom > Engine._MAX_ZOOM) zoom = Engine._MAX_ZOOM;
    else if (zoom < this._minZoom) zoom = this._minZoom;

    if (zoom !== this._zoom) {
      const source = this._projectPoint(target);
      this._zoom = zoom;
      this._fitted = false;

      this._position = this._translatePosition(
        vec2.sub(source, this._projectPoint(target))
      );
      this._updateView();
    }
  }

  public zoomIn(target?: vec2): void {
    this.setZoom(this._zoom * Engine._ZOOM_FACTOR, target);
  }

  public zoomOut(target?: vec2): void {
    this.setZoom(this._zoom / Engine._ZOOM_FACTOR, target);
  }

  public fit(): void {
    this.setZoom(this._minZoom);
    this._fitted = true;
  }

  public realSize(): void {
    this.setZoom(1);
  }

  public undo(): void {
    if (this._effect.undo()) this._draw();
  }

  public redo(): void {
    if (this._effect.redo()) this._draw();
  }

  public grayscale(
    type: Grayscale,
    weights = vec3.new(1 / 3, 1 / 3, 1 / 3)
  ): void {
    switch (type) {
      case Grayscale.HSL_L:
        this._effect.pushEffect({ effect: Effect.GRAYSCALE_HSL_L });
        break;
      case Grayscale.HSV_V:
        this._effect.pushEffect({ effect: Effect.GRAYSCALE_HSV_V });
        break;
      case Grayscale.CIELAB_L:
        this._effect.pushEffect({ effect: Effect.GRAYSCALE_CIELAB_L });
        break;
      case Grayscale.REC_601:
        this._effect.pushEffect({
          effect: Effect.GRAYSCALE_WEIGHT,
          params: {
            u_weight: {
              value: vec3.new(0.299, 0.587, 0.114),
              type: Uniform.FLOAT_VEC3,
            },
          },
        });
        break;
      case Grayscale.REC_709:
        this._effect.pushEffect({
          effect: Effect.GRAYSCALE_WEIGHT,
          params: {
            u_weight: {
              value: vec3.new(0.2126, 0.7152, 0.0722),
              type: Uniform.FLOAT_VEC3,
            },
          },
        });
        break;
      case Grayscale.REC_2100:
        this._effect.pushEffect({
          effect: Effect.GRAYSCALE_WEIGHT,
          params: {
            u_weight: {
              value: vec3.new(0.2627, 0.678, 0.0593),
              type: Uniform.FLOAT_VEC3,
            },
          },
        });
        break;
      case Grayscale.AVERAGE:
        this._effect.pushEffect({ effect: Effect.GRAYSCALE_AVERAGE });
        break;
      case Grayscale.RGB_R:
        this._effect.pushEffect({
          effect: Effect.GRAYSCALE_WEIGHT,
          params: {
            u_weight: { value: vec3.new(1, 0, 0), type: Uniform.FLOAT_VEC3 },
          },
        });
        break;
      case Grayscale.RGB_G:
        this._effect.pushEffect({
          effect: Effect.GRAYSCALE_WEIGHT,
          params: {
            u_weight: { value: vec3.new(0, 1, 0), type: Uniform.FLOAT_VEC3 },
          },
        });
        break;
      case Grayscale.RGB_B:
        this._effect.pushEffect({
          effect: Effect.GRAYSCALE_WEIGHT,
          params: {
            u_weight: { value: vec3.new(0, 0, 1), type: Uniform.FLOAT_VEC3 },
          },
        });
        break;
      case Grayscale.MANUAL:
        this._effect.pushEffect({
          effect: Effect.GRAYSCALE_WEIGHT,
          params: { u_weight: { value: weights, type: Uniform.FLOAT_VEC3 } },
        });
        break;
      default:
        throw new Error('Unknown grayscale method');
    }
    this._draw();
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
    this._effect.release();
  }
}
