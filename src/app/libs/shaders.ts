export const vertex = {
  neutral: `#version 300 es

layout (location = 0) in vec3 l_position;
layout (location = 1) in vec2 l_st_coord;

out vec2 f_st_coord;

void main () {
  f_st_coord = vec2(l_st_coord.s, l_st_coord.t);
  gl_Position = vec4(l_position, 1.0f);
}`,
  flipVertical: `#version 300 es

layout (location = 0) in vec3 l_position;
layout (location = 1) in vec2 l_st_coord;

out vec2 f_st_coord;

void main () {
  f_st_coord = vec2(l_st_coord.s, l_st_coord.t);
  gl_Position = vec4(l_position.x, -l_position.y, 0.0f, 1.0f);
}`,
  flipHorizontal: `#version 300 es

layout (location = 0) in vec3 l_position;
layout (location = 1) in vec2 l_st_coord;

out vec2 f_st_coord;

void main () {
  f_st_coord = vec2(l_st_coord.s, l_st_coord.t);
  gl_Position = vec4(-l_position.x, l_position.y, 0.0f, 1.0f);
}`,
  rotate: `#version 300 es

layout (location = 0) in vec3 l_position;
layout (location = 1) in vec2 l_st_coord;

uniform mat4 u_view;

out vec2 f_st_coord;

void main () {
  f_st_coord = vec2(l_st_coord.s, l_st_coord.t);
  gl_Position = u_view * vec4(l_position, 1.0f);
}`,
  view: `#version 300 es

layout (location = 0) in vec3 l_position;
layout (location = 1) in vec2 l_st_coord;

uniform mat4 u_view;

out vec2 f_st_coord;

void main () {
  f_st_coord = vec2(l_st_coord.s, l_st_coord.t);
  gl_Position = u_view * vec4(l_position, 1.0f);
}`,
} as const;

export const fragment = {
  neutral: `#version 300 es

precision highp float;

layout (location = 0) out vec4 o_color;

uniform sampler2D u_img;

in vec2 f_st_coord;

void main () {
  o_color = texture(u_img, f_st_coord);
}`,
  grayscaleHSL: `#version 300 es

precision highp float;

layout (location = 0) out vec4 o_color;

uniform sampler2D u_img;

in vec2 f_st_coord;

void main () {
  vec4 color = texture(u_img, f_st_coord);
  o_color = vec4(vec3((max(max(color.r, color.g), color.b) + min(min(color.r, color.g), color.b)) / 2.0f), color.a);
}`,
  grayscaleHSV: `#version 300 es

precision highp float;

layout (location = 0) out vec4 o_color;

uniform sampler2D u_img;

in vec2 f_st_coord;

void main () {
  vec4 color = texture(u_img, f_st_coord);
  o_color = vec4(vec3(max(max(color.r, color.g), color.b)), color.a);
}`,
  grayscaleCIELAB: `#version 300 es

precision highp float;

layout (location = 0) out vec4 o_color;

uniform sampler2D u_img;

in vec2 f_st_coord;

float gamma(float c) {
  return c > 0.04045f ? pow((c + 0.055f) / 1.055f, 2.4f) : c / 12.92f;
}

void main () {
  vec4 color = texture(u_img, f_st_coord);
  o_color = vec4(vec3(gamma(color.r) * 0.2126f + gamma(color.g) * 0.7152f + gamma(color.b) * 0.0722f), color.a);
}`,
  grayscaleWeight: `#version 300 es

precision highp float;

layout (location = 0) out vec4 o_color;

uniform sampler2D u_img;
uniform vec3 u_weight;

in vec2 f_st_coord;

void main () {
  vec4 color = texture(u_img, f_st_coord);
  vec3 gray = u_weight * color.rgb;
  o_color = vec4(vec3(clamp(gray.r + gray.g + gray.b, 0.0f, 1.0f)), color.a);
}`,
  invertR: `#version 300 es

precision highp float;

layout (location = 0) out vec4 o_color;

uniform sampler2D u_img;

in vec2 f_st_coord;

void main() {
  vec4 color = texture(u_img, f_st_coord);
  o_color = vec4(1.0f - color.r, color.gb, color.a);
}`,
  invertG: `#version 300 es

precision highp float;

layout (location = 0) out vec4 o_color;

uniform sampler2D u_img;

in vec2 f_st_coord;

void main() {
  vec4 color = texture(u_img, f_st_coord);
  o_color = vec4(color.r, 1.0f - color.g, color.b, color.a);
}`,
  invertB: `#version 300 es

precision highp float;

layout (location = 0) out vec4 o_color;

uniform sampler2D u_img;

in vec2 f_st_coord;

void main() {
  vec4 color = texture(u_img, f_st_coord);
  o_color = vec4(color.rg, 1.0f - color.b, color.a);
}`,
  invertRGB: `#version 300 es

precision highp float;

layout (location = 0) out vec4 o_color;

uniform sampler2D u_img;

in vec2 f_st_coord;

void main() {
  vec4 color = texture(u_img, f_st_coord);
  o_color = vec4(vec3(1.0f) - color.rgb, color.a);
}`,
  invertLightness: `#version 300 es

precision highp float;

layout (location = 0) out vec4 o_color;

uniform sampler2D u_img;

in vec2 f_st_coord;

float hueToRgb(float p, float q, float t) {
  if (t < 0.0f) t += 1.0f;
  else if (t > 1.0f) t -= 1.0f;

  if (t < 1.0f / 6.0f) return p + (q - p) * 6.0f * t;
  if (t < 0.5f) return q;
  if (t < 2.0f / 3.0f) return p + (q - p) * (2.0f / 3.0f - t) * 6.0f;

  return p;
}

vec3 hslToRgb(vec3 color) {
  if (color.y == 0.0f) return vec3(color.z);

  float q = color.z < 0.5f ? color.z * (1.0f + color.y) : color.z + color.y - color.z * color.y;
  float p = 2.0f * color.z - q;
  float t = 1.0f / 3.0f;

  return vec3(hueToRgb(p, q, color.x + t), hueToRgb(p, q, color.x), hueToRgb(p, q, color.x - t));
}

vec3 rgbToHsl(vec3 color) {
  float major = max(max(color.r, color.g), color.b);
  float minor = min(min(color.r, color.g), color.b);
  float m = major + minor;
  float l = m / 2.0f;

  if (major == minor) return vec3(0.0f, 0.0f, l);

  float d = major - minor;
  float s = l > 0.5f ? d / (2.0f - m) : d / m;

  float h = 0.0f;

  if (major == color.r) h = (color.g - color.b) / d + (color.g < color.b ? 6.0f : 0.f);
  else if (major == color.g) h = (color.b - color.r) / d + 2.0f;
  else h = (color.r - color.g) / d + 4.0f;

  return vec3(h / 6.0f, s, l);
}

void main() {
  vec4 color = texture(u_img, f_st_coord);
  vec3 hsl = rgbToHsl(color.rgb);
  hsl.z = 1.0f - hsl.z;

  o_color = vec4(hslToRgb(hsl), color.a);
}`,
} as const;
