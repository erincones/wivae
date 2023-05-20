import { Effect } from '../enums/effect';
import { fragment, vertex } from '../libs/shaders';

export class ProgramsCollection {
  private _gl: WebGL2RenderingContext;

  private _programs: Readonly<Record<Effect, WebGLProgram>>;

  private _uniforms: Readonly<
    Record<Effect, Map<string, WebGLUniformLocation | null>>
  >;

  private _active: Effect | null;

  public constructor(gl: WebGL2RenderingContext) {
    this._gl = gl;
    this._active = null;

    const shaders = {
      vertex: this._compileShaders(
        vertex,
        WebGL2RenderingContext.VERTEX_SHADER
      ),
      fragment: this._compileShaders(
        fragment,
        WebGL2RenderingContext.FRAGMENT_SHADER
      ),
    } as const;

    this._programs = {
      [Effect.VIEWER]: this._link(
        shaders.vertex.view,
        shaders.fragment.neutral
      ),
      [Effect.ROTATE]: this._link(
        shaders.vertex.rotate,
        shaders.fragment.neutral
      ),
      [Effect.FLIP_VERTICAL]: this._link(
        shaders.vertex.flipVertical,
        shaders.fragment.neutral
      ),
      [Effect.FLIP_HORIZONTAL]: this._link(
        shaders.vertex.flipHorizontal,
        shaders.fragment.neutral
      ),
      [Effect.GRAYSCALE_HSL_L]: this._link(
        shaders.vertex.neutral,
        shaders.fragment.grayscaleHSL
      ),
      [Effect.GRAYSCALE_HSV_V]: this._link(
        shaders.vertex.neutral,
        shaders.fragment.grayscaleHSV
      ),
      [Effect.GRAYSCALE_CIELAB_L]: this._link(
        shaders.vertex.neutral,
        shaders.fragment.grayscaleCIELAB
      ),
      [Effect.GRAYSCALE_AVERAGE]: this._link(
        shaders.vertex.neutral,
        shaders.fragment.grayscaleAVG
      ),
      [Effect.GRAYSCALE_WEIGHT]: this._link(
        shaders.vertex.neutral,
        shaders.fragment.grayscaleWeight
      ),
    };

    this._uniforms = Object.values(Effect).reduce((uniforms, effect) => {
      if (typeof effect !== 'string')
        uniforms[effect] = new Map<string, WebGLUniformLocation>();

      return uniforms;
    }, {} as Record<Effect, Map<string, WebGLUniformLocation | null>>);

    Object.values(shaders).forEach((array) => {
      Object.values(array).forEach((shader) => {
        this._gl.deleteShader(shader);
      });
    });
  }

  private _compileShaders<T extends Record<string, string>>(
    shaders: T,
    type: WebGL2RenderingContext['VERTEX_SHADER' | 'FRAGMENT_SHADER']
  ): Readonly<Record<keyof T, WebGLShader>> {
    return Object.entries(shaders).reduce((shaders, [name, code]) => {
      shaders[name as keyof T] = this._compileShader(type, code, name);
      return shaders;
    }, {} as Record<keyof T, WebGLShader>);
  }

  private _compileShader(
    type: WebGL2RenderingContext['VERTEX_SHADER' | 'FRAGMENT_SHADER'],
    src: string,
    name?: string
  ): WebGLShader {
    let stage: string;
    switch (type) {
      case WebGL2RenderingContext.VERTEX_SHADER:
        stage = '(vertex)';
        break;
      case WebGL2RenderingContext.FRAGMENT_SHADER:
        stage = '(fragment)';
        break;
      default:
        stage = '(unknown)';
    }

    const log = name ? `${name} ${stage}` : stage;
    const shader = this._gl.createShader(type);

    if (shader === null) throw new Error(`Could not create the shader: ${log}`);

    this._gl.shaderSource(shader, src);
    this._gl.compileShader(shader);

    if (
      !this._gl.getShaderParameter(
        shader,
        WebGL2RenderingContext.COMPILE_STATUS
      )
    ) {
      const message = `Could not compile the shader: ${log}\n${
        this._gl.getShaderInfoLog(shader) || 'unknown'
      }`;

      this._gl.deleteShader(shader);
      throw new Error(message);
    }

    return shader;
  }

  private _link(vertex: WebGLShader, fragment: WebGLShader): WebGLProgram {
    const program = this._gl.createProgram();

    if (program === null) throw new Error('Could not create the program.');

    this._gl.attachShader(program, vertex);
    this._gl.attachShader(program, fragment);
    this._gl.linkProgram(program);

    if (
      !this._gl.getProgramParameter(program, WebGL2RenderingContext.LINK_STATUS)
    ) {
      const message = `Could not link the program\n: ${
        this._gl.getProgramInfoLog(program) || 'unknown'
      }`;

      this._gl.deleteProgram(program);
      throw new Error(message);
    }

    return program;
  }

  public use(program: Effect | null): void {
    if (this._active === program) return;

    this._active = program;
    this._gl.useProgram(program === null ? null : this._programs[program]);
  }

  public getUniformLocation(name: string): WebGLUniformLocation | null {
    if (this._active === null) return null;

    const map = this._uniforms[this._active];
    let uniform = map.get(name);

    if (uniform === undefined) {
      uniform = this._gl.getUniformLocation(this._programs[this._active], name);
      map.set(name, uniform);
    }

    return uniform;
  }

  public release(): void {
    Object.values(this._programs).forEach((program) => {
      this._gl.deleteProgram(program);
    });
  }
}
