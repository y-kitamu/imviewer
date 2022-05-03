#version 300 es
layout (location=0) in vec3 aPos;
layout (location=1) in vec3 aColor;

uniform mat4 mvp[2];
uniform float scale[2];

out vec3 fragColor;

void main() {
    fragColor = aColor;
    gl_Position = mvp[gl_VertexID % 2] * vec4(aPos, 1.0) / scale[gl_VertexID % 2];
}
