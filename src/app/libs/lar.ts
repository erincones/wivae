export type vec3 = [number, number, number];
export type vec4 = [number, number, number, number];
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
  number,
];

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
  zero: (): mat4 => {
    return new Float32Array(16) as unknown as mat4;
  },

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

  scale: (a: mat4, scale: vec3): mat4 => {
    return new Float32Array([
      a[0] * scale[0],
      a[1] * scale[0],
      a[2] * scale[0],
      a[3],
      a[4] * scale[1],
      a[5] * scale[1],
      a[6] * scale[1],
      a[7],
      a[8] * scale[2],
      a[9] * scale[2],
      a[10] * scale[2],
      a[11],
      a[12],
      a[13],
      a[14],
      a[15],
    ]) as unknown as mat4;
  },
};
