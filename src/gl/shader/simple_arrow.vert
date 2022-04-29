#version 300 es
layout (location=0) in vec3 aPos;
layout (location=1) in vec3 aColor;
layout (location=2) in vec3 aDirection;

layout (std140) uniform matrix {
    mat4 mvp;
} mat;

out vec3 geomColor;
out vec3 geomDirection;

void main() {
    geomColor = aColor;
    geomDirection = (mat.mvp * vec4(aDirection, 0.0)).xyz;
    gl_Position = mat.mvp * vec4(aPos, 1.0);
}
