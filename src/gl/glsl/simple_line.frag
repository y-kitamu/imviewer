#version 300 es
precision mediump float;
in vec3 fragColor;
in vec2 xy;

uniform vec2 minPos[2];
uniform vec2 maxPos[2];

out vec4 outColor;

void main() {
    outColor = vec4(fragColor, 1.0);
}
