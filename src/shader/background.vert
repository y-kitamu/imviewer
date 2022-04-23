#version 300 es
layout (location = 0) in vec4 aPosition;
layout (location = 0) in vec4 aColor;
out lowp vec4 vColor;

void main() {
    gl_Position = aPosition;
    vColor = aColor;
}
