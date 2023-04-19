export default `#version 300 es

layout (location = 0) in vec4 l_position;
layout (location = 1) in vec2 l_st_coord;

out vec2 f_st_coord;

void main() {
  f_st_coord = vec2(l_st_coord.s, 1.0f - l_st_coord.t);
  gl_Position = l_position;
}
`;
