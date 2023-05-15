export type vec2 = [number, number];
export type vec3 = [number, number, number];
export type mat4 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

export const vec2 = {
  zero: (): vec2 => {
    return new Float32Array(2) as unknown as vec2;
  },

  new: (x: number, y: number): vec2 => {
    return new Float32Array([x, y]) as unknown as vec2;
  },

  add: (a: Readonly<vec2>, b: Readonly<vec2>): vec2 => {
    return new Float32Array([a[0] + b[0], a[1] + b[1]]) as unknown as vec2;
  },

  sub: (a: Readonly<vec2>, b: Readonly<vec2>): vec2 => {
    return new Float32Array([a[0] - b[0], a[1] - b[1]]) as unknown as vec2;
  },

  div: (a: Readonly<vec2>, b: Readonly<vec2>): vec2 => {
    return new Float32Array([a[0] / b[0], a[1] / b[1]]) as unknown as vec2;
  },

  equals: (a: Readonly<vec2>, b: Readonly<vec2>): boolean => {
    return a[0] === b[0] && a[1] === b[1];
  },

  abs: (a: Readonly<vec2>): vec2 => {
    return new Float32Array([
      Math.abs(a[0]),
      Math.abs(a[1]),
    ]) as unknown as vec2;
  },

  scale: (a: Readonly<vec2>, scale: number): vec2 => {
    return new Float32Array([a[0] * scale, a[1] * scale]) as unknown as vec2;
  },

  max: (a: Readonly<vec2>): number => {
    const x = a[0];
    const y = a[1];
    return x > y ? x : y;
  },
};

export const vec3 = {
  zero: (): vec3 => {
    return new Float32Array(3) as unknown as vec3;
  },

  new: (x: number, y: number, z: number): vec3 => {
    return new Float32Array([x, y, z]) as unknown as vec3;
  },

  scale: (a: Readonly<vec3>, scale: number): vec3 => {
    return new Float32Array([
      a[0] * scale,
      a[1] * scale,
      a[2] * scale,
    ]) as unknown as vec3;
  },
};

export const mat4 = {
  new: (x: number): mat4 => {
    return new Float32Array([
      x,
      0,
      0,
      0,
      0,
      x,
      0,
      0,
      0,
      0,
      x,
      0,
      0,
      0,
      0,
      x,
    ]) as unknown as mat4;
  },

  scale: (a: Readonly<mat4>, scale: Readonly<vec2>): mat4 => {
    const x = scale[0];
    const y = scale[1];
    const z = 1;
    return new Float32Array([
      a[0] * x,
      a[1] * x,
      a[2] * x,
      a[3] * x,
      a[4] * y,
      a[5] * y,
      a[6] * y,
      a[7] * y,
      a[8] * z,
      a[9] * z,
      a[10] * z,
      a[11] * z,
      a[12],
      a[13],
      a[14],
      a[15],
    ]) as unknown as mat4;
  },

  translate: (a: Readonly<mat4>, translation: Readonly<vec2>): mat4 => {
    const x = translation[0];
    const y = translation[1];
    const z = 0;
    const a0 = a[0];
    const a1 = a[1];
    const a2 = a[2];
    const a3 = a[3];
    const a4 = a[4];
    const a5 = a[5];
    const a6 = a[6];
    const a7 = a[7];
    const a8 = a[8];
    const a9 = a[9];
    const a10 = a[10];
    const a11 = a[11];
    return new Float32Array([
      a0,
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      a7,
      a8,
      a9,
      a10,
      a11,
      a0 * x + a4 * y + a8 * z + a[12],
      a1 * x + a5 * y + a9 * z + a[13],
      a2 * x + a6 * y + a10 * z + a[14],
      a3 * x + a7 * y + a11 * z + a[15],
    ]) as unknown as mat4;
  },
};
