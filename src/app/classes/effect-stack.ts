import { Effect } from '../enums/effect';
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
  readonly effect: Effect;
  readonly resolution: vec2;
  readonly params?: Readonly<Record<string, EffectParam>>;
}

export class EffectStack {
  private _gl: WebGL2RenderingContext;

  private _source: WebGLTexture;

  private _resolution: vec2[];

  private _texture: WebGLTexture[];

  private _fbo: WebGLFramebuffer[];

  private _stack: EffectData[];

  private _untraversed: boolean;

  private _from: number;

  private _to: number;

  public constructor(gl: WebGL2RenderingContext, image: HTMLImageElement) {
    this._gl = gl;
    this._source = this._createTexture();

    this._gl.pixelStorei(WebGL2RenderingContext.UNPACK_FLIP_Y_WEBGL, true);
    this._gl.texImage2D(
      WebGL2RenderingContext.TEXTURE_2D,
      0,
      WebGL2RenderingContext.RGBA,
      WebGL2RenderingContext.RGBA,
      WebGL2RenderingContext.UNSIGNED_BYTE,
      image
    );
    this._gl.generateMipmap(WebGL2RenderingContext.TEXTURE_2D);
    this._gl.pixelStorei(WebGL2RenderingContext.UNPACK_FLIP_Y_WEBGL, false);

    this._resolution = [];
    this._texture = [];
    this._fbo = [];
    for (let i = 0; i < 2; ++i) {
      const texture = this._createTexture();
      this._resolution.push(vec2.new(image.width, image.width));
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
        null
      );

      this._fbo.push(this._createFrameBuffer(texture));
    }

    this._stack = [];
    this._untraversed = true;
    this._from = 0;
    this._to = 0;
  }

  public get length(): number {
    return this._to;
  }

  public get canUndo(): boolean {
    return this._to > 0;
  }

  public get canRedo(): boolean {
    return this._to < this._stack.length;
  }

  private _createTexture(): WebGLTexture {
    const texture = this._gl.createTexture();

    if (texture === null) throw new Error('Could not create texture');

    this._gl.activeTexture(this._gl.TEXTURE0);
    this._gl.bindTexture(this._gl.TEXTURE_2D, texture);
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
      WebGL2RenderingContext.TEXTURE_2D,
      WebGL2RenderingContext.TEXTURE_MIN_FILTER,
      WebGL2RenderingContext.LINEAR_MIPMAP_NEAREST
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
      0
    );

    if (
      this._gl.checkFramebufferStatus(WebGL2RenderingContext.FRAMEBUFFER) !==
      WebGL2RenderingContext.FRAMEBUFFER_COMPLETE
    )
      throw new Error('Could not complete frame buffer');

    return fbo;
  }

  public bindTexture(i: number | null = null): void {
    this._gl.bindTexture(
      WebGL2RenderingContext.TEXTURE_2D,
      i === null ? this._source : this._texture[i]
    );
  }

  private _resizeTexture(i: number, resolution: vec2): void {
    if (vec2.equals(resolution, this._resolution[i])) return;

    const current: WebGLTexture = this._gl.getParameter(
      WebGL2RenderingContext.TEXTURE_BINDING_2D
    );

    this.bindTexture(i);
    this._gl.texImage2D(
      WebGL2RenderingContext.TEXTURE_2D,
      0,
      WebGL2RenderingContext.RGBA,
      resolution[0],
      resolution[1],
      0,
      WebGL2RenderingContext.RGBA,
      WebGL2RenderingContext.UNSIGNED_BYTE,
      null
    );
    this._gl.bindTexture(WebGL2RenderingContext.TEXTURE_2D, current);

    this._resolution[i] = resolution;
  }

  public bindFBO(i: number | null = null): void {
    this._gl.bindFramebuffer(
      WebGL2RenderingContext.FRAMEBUFFER,
      i === null ? null : this._fbo[i]
    );
  }

  public pushEffect(effect: EffectData): void {
    if (this._to < this._stack.length) {
      this._stack.splice(this._to);
    }

    this._stack.push(effect);
    this._to = this._stack.length;
  }

  public clearEffects(): void {
    this._stack = [];
    this._from = 0;
    this._to = 0;
  }

  public undo(): boolean {
    if (this.canUndo) {
      this._from = 0;
      --this._to;
      this._untraversed = this._to === 0;
      return true;
    }

    return false;
  }

  public redo(): boolean {
    if (this.canRedo) {
      ++this._to;
      return true;
    }

    return false;
  }

  public traverse(callBack: (data: EffectData) => void): vec2 | undefined {
    if (this._untraversed) {
      this.bindTexture();
      this.bindFBO();
      this._untraversed = false;
      return undefined;
    }
    if (this._stack.length === 0) return undefined;
    if (this._from !== this._to) {
      if (this._from === 0) this.bindTexture();

      for (let i = this._from; i < this._to; ++i) {
        const curr = i & 1;
        const effect = this._stack[i];
        this.bindFBO(curr);
        this._resizeTexture(curr, effect.resolution);
        callBack(effect);
        this.bindTexture(curr);
        this._gl.generateMipmap(WebGL2RenderingContext.TEXTURE_2D);
      }

      this._from = this._to;
      this.bindFBO();
    }

    return this._to ? this._stack[this._to - 1].resolution : undefined;
  }

  public release(): void {
    this._gl.deleteTexture(this._source);
    for (let i = 0; i < 2; ++i) {
      this._gl.deleteFramebuffer(this._fbo[i]);
      this._gl.deleteTexture(this._texture[i]);
    }
  }
}
