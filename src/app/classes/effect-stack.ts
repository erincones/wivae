import { Program } from '../enums/program';
import { Uniform } from '../enums/uniform';
import { mat4, vec2, vec3 } from '../libs/lar';

type EffectParam =
  | {
      readonly type: Uniform.FLOAT;
      readonly value: number;
    }
  | {
      readonly type: Uniform.FLOAT_VEC3;
      readonly value: vec3;
    }
  | {
      readonly type: Uniform.FLOAT_MAT4;
      readonly value: mat4;
    }
  | {
      readonly type: Uniform.FLOAT_ARRAY;
      readonly value: Float32Array;
    };

export interface EffectData {
  readonly program: Program;
  readonly size: vec2;
  readonly params?: Readonly<Record<string, EffectParam>>;
}

export class EffectStack {
  private _gl: WebGL2RenderingContext;

  private _imageSize: vec2;

  private _source: WebGLTexture;

  private _texture: WebGLTexture[];

  private _fbo: WebGLFramebuffer[];

  private _next?: EffectData;

  private _stack: EffectData[];

  private _from: number;

  private _to: number;

  private _pending: boolean;

  public constructor(gl: WebGL2RenderingContext, image: HTMLImageElement) {
    this._gl = gl;
    this._imageSize = vec2.new(image.width, image.height);
    this._source = this._createTexture();

    this._gl.pixelStorei(WebGL2RenderingContext.UNPACK_FLIP_Y_WEBGL, true);
    this._gl.texImage2D(
      WebGL2RenderingContext.TEXTURE_2D,
      0,
      WebGL2RenderingContext.RGBA,
      WebGL2RenderingContext.RGBA,
      WebGL2RenderingContext.UNSIGNED_BYTE,
      image,
    );
    this._gl.generateMipmap(WebGL2RenderingContext.TEXTURE_2D);
    this._gl.pixelStorei(WebGL2RenderingContext.UNPACK_FLIP_Y_WEBGL, false);

    this._texture = [];
    this._fbo = [];
    for (let i = 0; i < 2; ++i) {
      const texture = this._createTexture();
      this._texture.push(texture);
      this._gl.texImage2D(
        WebGL2RenderingContext.TEXTURE_2D,
        0,
        WebGL2RenderingContext.RGBA,
        image.width,
        image.height,
        0,
        WebGL2RenderingContext.RGBA,
        WebGL2RenderingContext.UNSIGNED_BYTE,
        null,
      );

      this._fbo.push(this._createFrameBuffer(texture));
    }

    this._stack = [];
    this._from = 0;
    this._to = 0;
    this._pending = false;
  }

  public get length(): number {
    return this._to;
  }

  public get canUndo(): boolean {
    return this._next === undefined && this._to > 0;
  }

  public get canRedo(): boolean {
    return this._next === undefined && this._to < this._stack.length;
  }

  private _createTexture(): WebGLTexture {
    const texture = this._gl.createTexture();

    if (texture === null) throw new Error('Could not create texture');

    this._gl.activeTexture(this._gl.TEXTURE0);
    this._gl.bindTexture(this._gl.TEXTURE_2D, texture);
    this._gl.texParameteri(
      WebGL2RenderingContext.TEXTURE_2D,
      WebGL2RenderingContext.TEXTURE_WRAP_S,
      WebGL2RenderingContext.CLAMP_TO_EDGE,
    );
    this._gl.texParameteri(
      WebGL2RenderingContext.TEXTURE_2D,
      WebGL2RenderingContext.TEXTURE_WRAP_T,
      WebGL2RenderingContext.CLAMP_TO_EDGE,
    );
    this._gl.texParameteri(
      WebGL2RenderingContext.TEXTURE_2D,
      WebGL2RenderingContext.TEXTURE_MAG_FILTER,
      WebGL2RenderingContext.NEAREST,
    );
    this._gl.texParameteri(
      WebGL2RenderingContext.TEXTURE_2D,
      WebGL2RenderingContext.TEXTURE_MIN_FILTER,
      WebGL2RenderingContext.LINEAR_MIPMAP_NEAREST,
    );

    return texture;
  }

  private _createFrameBuffer(texture: WebGLTexture): WebGLFramebuffer {
    const fbo = this._gl.createFramebuffer();

    if (fbo === null) throw new Error('Could not create frame buffer');

    this._gl.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, fbo);
    this._gl.framebufferTexture2D(
      WebGL2RenderingContext.FRAMEBUFFER,
      WebGL2RenderingContext.COLOR_ATTACHMENT0,
      WebGL2RenderingContext.TEXTURE_2D,
      texture,
      0,
    );

    if (
      this._gl.checkFramebufferStatus(WebGL2RenderingContext.FRAMEBUFFER) !==
      WebGL2RenderingContext.FRAMEBUFFER_COMPLETE
    )
      throw new Error('Could not complete frame buffer');

    return fbo;
  }

  private _resizeTexture(target: number, size: vec2): void {
    const currentTexture: WebGLTexture | null = this._gl.getParameter(
      WebGL2RenderingContext.TEXTURE_BINDING_2D,
    );

    this.bindTexture(target);
    this._gl.texImage2D(
      WebGL2RenderingContext.TEXTURE_2D,
      0,
      WebGL2RenderingContext.RGBA,
      size[0],
      size[1],
      0,
      WebGL2RenderingContext.RGBA,
      WebGL2RenderingContext.UNSIGNED_BYTE,
      null,
    );
    this._gl.bindTexture(WebGL2RenderingContext.TEXTURE_2D, currentTexture);
  }

  private _process(
    callBack: (data: EffectData) => void,
    curr: number,
    effect: EffectData,
  ): EffectData {
    this._resizeTexture(curr, effect.size);

    this.bindFBO(curr);
    callBack(effect);
    this.bindTexture(curr);
    this._gl.generateMipmap(WebGL2RenderingContext.TEXTURE_2D);

    return effect;
  }

  public get waiting(): boolean {
    return this._next !== undefined;
  }

  public bindTexture(i: number | null = null): void {
    this._gl.bindTexture(
      WebGL2RenderingContext.TEXTURE_2D,
      i === null ? this._source : this._texture[i],
    );
  }

  public bindFBO(i: number | null = null): void {
    this._gl.bindFramebuffer(
      WebGL2RenderingContext.FRAMEBUFFER,
      i === null ? null : this._fbo[i],
    );
  }

  public prepareNext(effect: EffectData): void {
    this._next = effect;
    this._pending = true;
  }

  public acceptNext(): void {
    if (this._next) {
      const next = this._next;
      this._pending = false;
      delete this._next;
      this.push(next);
    }
  }

  public cancelNext(): void {
    this._from = 0;
    this._pending = false;
    delete this._next;
  }

  public push(...effects: EffectData[]): void {
    this.acceptNext();
    if (this._to < this._stack.length) this._stack.splice(this._to);

    this._stack.push(...effects);
    this._to = this._stack.length;
  }

  public clear(): boolean {
    if (this._stack.length || this._next) {
      delete this._next;
      this._stack = [];
      this._from = 0;
      this._to = 0;
      this._pending = false;
      return true;
    }

    return false;
  }

  public undo(): boolean {
    const can = this.canUndo;
    if (can) {
      this._from = 0;
      --this._to;
    }

    return can;
  }

  public redo(): boolean {
    const can = this.canRedo;
    if (can) ++this._to;

    return can;
  }

  public traverse(callBack: (data: EffectData) => void): vec2 {
    let effect: EffectData | undefined;
    let curr: number;

    if (this._from === 0 && this._next === undefined) this.bindTexture();
    if (this._from !== this._to) {
      for (let i = this._from; i < this._to; ++i) {
        effect = this._process(callBack, i & 1, this._stack[i]);
      }

      this._from = this._to;
    }
    if (this._next && this._pending) {
      if (this._to === 0) {
        this.bindTexture();
        curr = 0;
      } else {
        this.bindTexture((this._to - 1) & 1);
        curr = this._to & 1;
      }

      effect = this._process(callBack, curr, this._next);
      this._pending = false;
    }

    this.bindFBO();
    return effect?.size || this._imageSize;
  }

  public release(): void {
    this._gl.deleteTexture(this._source);
    for (let i = 0; i < 2; ++i) {
      this._gl.deleteFramebuffer(this._fbo[i]);
      this._gl.deleteTexture(this._texture[i]);
    }
  }
}
