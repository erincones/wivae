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
  float sum = max(max(color.r, color.g), color.b) + min(min(color.r, color.g), color.b);
  o_color = vec4(vec3(sum / 2.0f), color.a);
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
  float gray = gamma(color.r) * 0.2126f + gamma(color.g) * 0.7152f + gamma(color.b) * 0.0722f;
  o_color = vec4(vec3(gray), color.a);
}`,
  grayscaleAVG: `#version 300 es

precision highp float;

layout (location = 0) out vec4 o_color;

uniform sampler2D u_img;

in vec2 f_st_coord;

void main () {
  vec4 color = texture(u_img, f_st_coord);
  o_color = vec4(vec3((color.r + color.g + color.b) / 3.0f), color.a);
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
} as const;
