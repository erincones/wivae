export default `#version 300 es

precision highp float;

uniform sampler2D u_img;

in vec2 f_st_coord;

out vec4 o_color;

void main() {
  o_color = texture(u_img, f_st_coord);
}
`;
