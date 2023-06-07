export const vertex = {
  neutral: `#version 300 es

layout (location = 0) in vec3 l_position;
layout (location = 1) in vec2 l_st_coord;

out vec2 f_st_coord;

void main () {
  f_st_coord = vec2(l_st_coord.s, l_st_coord.t);
  gl_Position = vec4(l_position, 1.0f);
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
  invertRGB: `#version 300 es

precision highp float;

layout (location = 0) out vec4 o_color;

uniform sampler2D u_img;
uniform vec3 u_weight;

in vec2 f_st_coord;

void main() {
  vec4 color = texture(u_img, f_st_coord);
  o_color = vec4(abs(u_weight - color.rgb), color.a);
}`,
  invertHSL: `#version 300 es

precision highp float;

layout (location = 0) out vec4 o_color;

uniform sampler2D u_img;
uniform vec3 u_weight;

in vec2 f_st_coord;

float hueToRgb(float p, float q, float t) {
  t *= 6.0f;
  if (t < 0.0f) t += 6.0f;
  else if (t > 6.0f) t -= 6.0f;

  if (t < 1.0f) return p + (q - p) * t;
  if (t < 3.0f) return q;
  if (t < 4.0f) return p + (q - p) * (4.0f - t);
  return p;
}

vec3 hslToRgb(float h, float s, float l) {
  if (s == 0.0f) return vec3(l);

  float q = l < 0.5f ? l * (1.0f + s) : l + s - l * s;
  float p = 2.0f * l - q;
  float t = 1.0 / 3.0f;

  return vec3(hueToRgb(p, q, h + t), hueToRgb(p, q, h), hueToRgb(p, q, h - t));
}

vec3 rgbToHsl(float r, float g, float b) {
  float major = max(max(r, g), b);
  float minor = min(min(r, g), b);
  float l = (major + minor) / 2.0f;

  if (major == minor) return vec3(0.0f, 0.0f, l);

  float d = major - minor;
  float h;

  if (major == r) h = (g - b) / d + (g < b ? 6.0f : 0.0f);
  else if (major == g) h = (b - r) / d + 2.0f;
  else h = (r - g) / d + 4.0f;

  return vec3(h / 6.0f, l > 0.5f ? d / (2.0f - major - minor) : d / (major + minor), l);
}

void main() {
  vec4 color = texture(u_img, f_st_coord);
  vec3 hsl = abs(u_weight - rgbToHsl(color.r, color.g, color.b));

  o_color = vec4(hslToRgb(hsl.x, hsl.y, hsl.z), color.a);
}`,
  invertHSV: `#version 300 es

precision highp float;

layout (location = 0) out vec4 o_color;

uniform sampler2D u_img;
uniform vec3 u_weight;

in vec2 f_st_coord;

vec3 hsvToRgb(float h, float s, float v) {
  float i;
  float f = modf(h == 1.0f ? 0.0f : h * 6.0f, i);

  float p = v * (1.0f - s);
  float q = v * (1.0f - s * f);
  float t = v * (1.0f - s * (1.0f - f));

  if (i < 1.0f) return vec3(v, t, p);
  if (i < 2.0f) return vec3(q, v, p);
  if (i < 3.0f) return vec3(p, v, t);
  if (i < 4.0f) return vec3(p, q, v);
  if (i < 5.0f) return vec3(t, p, v);
  return vec3(v, p, q);
}

vec3 rgbToHsv(float r, float g, float b) {
  float major = max(max(r, g), b);
  float minor = min(min(r, g), b);
  float d = major - minor;
  float h;

  if (major == minor) h = 0.0f;
  else if (major == r) h = (g - b) / d + (g < b ? 6.0f : 0.0f);
  else if (major == g) h = (b - r) / d + 2.0f;
  else h = (r - g) / d + 4.0f;

  return vec3(h / 6.0f, major == 0.0f ? 0.0f : d / major, major);
}

void main() {
  vec4 color = texture(u_img, f_st_coord);
  vec3 hsv = abs(u_weight - rgbToHsv(color.r, color.g, color.b));

  o_color = vec4(hsvToRgb(hsv.x, hsv.y, hsv.z), color.a);
}`,
} as const;
