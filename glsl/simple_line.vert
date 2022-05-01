#version 300 es
layout (location=0) in vec3 aPos;
layout (location=1) in vec3 aColor;

layout (std140) uniform matrix {
    mat4 mvp[2];
} mat;

out vec3 fragColor;

void main() {
    fragColor = aColor;
    gl_Position = mat.mvp[gl_VertexID % 2] * vec4(aPos, 1.0);
}
