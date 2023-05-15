export const vertex = {
  view: `#version 300 es

layout (location = 0) in vec3 l_position;
layout (location = 1) in vec2 l_st_coord;

uniform mat4 u_view;
out vec2 f_st_coord;

void main() {
  f_st_coord = vec2(l_st_coord.s, 1.0f - l_st_coord.t);
  gl_Position = u_view * vec4(l_position, 1.0f);
}`,
} as const;

export const fragment = {
  original: `#version 300 es

precision highp float;

uniform sampler2D u_img;

in vec2 f_st_coord;

out vec4 o_color;

void main() {
  o_color = texture(u_img, f_st_coord);
}`,
} as const;
