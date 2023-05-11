export class GLSLProgram {
  private _id: WebGLProgram | null;

  private _vertSrc: string;

  private _fragSrc: string;

  public constructor(vertSrc: string, fragSrc: string) {
    this._id = null;
    this._vertSrc = vertSrc;
    this._fragSrc = fragSrc;
  }

  private _compileShader(
    gl: WebGL2RenderingContext,
    type: WebGL2RenderingContext['VERTEX_SHADER' | 'FRAGMENT_SHADER'],
    src: string
  ): WebGLShader {
    const stage = type === gl.VERTEX_SHADER ? 'vertex' : 'fragment';
    const shader = gl.createShader(type);

    if (shader === null)
      throw new Error(`Could not create the ${stage} shader`);

    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = `Could not compile the given ${stage} shader:\n${
        gl.getShaderInfoLog(shader) || 'unknown'
      }`;

      gl.deleteShader(shader);
      throw new Error(message);
    }

    return shader;
  }

  public link(gl: WebGL2RenderingContext): void {
    this._id = gl.createProgram();

    if (this._id === null) throw new Error('Could not create the program.');

    const vertShader = this._compileShader(gl, gl.VERTEX_SHADER, this._vertSrc);
    const fragShader = this._compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      this._fragSrc
    );

    gl.attachShader(this._id, vertShader);
    gl.attachShader(this._id, fragShader);
    gl.linkProgram(this._id);
    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);

    if (!gl.getProgramParameter(this._id, gl.LINK_STATUS)) {
      const message = `Could not link the program\n: ${
        gl.getProgramInfoLog(this._id) || 'unknown'
      }`;

      gl.deleteProgram(this._id);
      throw new Error(message);
    }
  }

  public use(gl: WebGL2RenderingContext): void {
    gl.useProgram(this._id);
  }

  public getUniformLocation(
    gl: WebGL2RenderingContext,
    name: string
  ): WebGLUniformLocation | null {
    if (this._id === null) throw new Error('Not valid GLSL program');
    return gl.getUniformLocation(this._id, name);
  }

  public delete(gl: WebGL2RenderingContext): void {
    gl.deleteProgram(this._id);
    this._id = null;
  }
}
