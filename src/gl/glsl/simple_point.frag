#version 300 es
precision mediump float;
in vec3 fragColor;
in vec2 xy;

uniform vec2 minPos[1];
uniform vec2 maxPos[1];

out vec4 outColor;

void main() {
    if (xy.x < minPos[0].x || maxPos[0].x < xy.x || xy.y < minPos[0].y || maxPos[0].y < xy.y) {
        discard;
    }
    outColor = vec4(fragColor, 1.0);
}
