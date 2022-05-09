#version 300 es
layout (location=0) in vec3 aPos;
layout (location=1) in vec3 aColor;

uniform mat4 mvp;
uniform float scale;

out vec3 fragColor;

void main() {
    fragColor = aColor;
    gl_Position = mvp * (vec4(aPos / scale, 1.0) * 2.0 - 1.0);
    gl_PointSize = 10.0;
}
