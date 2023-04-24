import { Injectable } from '@angular/core';
import baseVert from '../shaders/base.vert';
import baseFrag from '../shaders/base.frag';
import { CoreService } from './core.service';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  private _gl: WebGL2RenderingContext | null;

  private _bg: [number, number, number, number];

  public constructor(private _core: CoreService) {
    this._gl = null;
    this._bg = [1, 1, 1, 1];
  }

  private _createShader(
    type: WebGL2RenderingContext['VERTEX_SHADER' | 'FRAGMENT_SHADER'],
    src: string,
  ): WebGLShader {
    const gl = this.gl;
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

  private _createProgram(vertSrc: string, fragSrc: string): WebGLProgram {
    const gl = this.gl;
    const program = gl.createProgram();

    if (program === null) throw new Error('Could not create the program.');

    const vertShader = this._createShader(gl.VERTEX_SHADER, vertSrc);
    const fragShader = this._createShader(gl.FRAGMENT_SHADER, fragSrc);

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = `Could not link the program\n: ${
        gl.getProgramInfoLog(program) || 'unknown'
      }`;

      gl.deleteProgram(program);
      throw new Error(message);
    }

    return program;
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

  public setup(canvas: HTMLCanvasElement): void {
    this._gl = canvas.getContext('webgl2');
    const gl = this.gl;

    gl.clearColor(...this._bg);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const program = this._createProgram(baseVert, baseFrag);
    gl.useProgram(program);

    const data = new Float32Array([
      -1.0, 1.0, 0.0, 1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
      1.0, 0.0,
    ]);

    const index = new Int8Array([0, 1, 2, 3]);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);

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

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this._core.image,
    );
    gl.uniform1i(gl.getUniformLocation(program, 'u_img'), 0);
  }

  public resizeViewport(width: number, height: number): void {
    const gl = this.gl;
    gl.viewport(0, 0, width, height);
    this._draw();
  }

  public closeImage(): void {
    this._gl = null;
    this._core.closeFile();
  }
}
