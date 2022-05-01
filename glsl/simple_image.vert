#version 300 es
layout (location=0) in vec3 aPos;
layout (location=1) in vec2 aTexCoord;

layout (std140) uniform matrix {
    mat4 mvp;
} mat;

out vec2 texCoord;

void main() {
    texCoord = aTexCoord;
    gl_Position = mat.mvp * vec4(aPos, 1.0);
}
