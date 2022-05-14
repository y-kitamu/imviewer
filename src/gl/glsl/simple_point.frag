#version 300 es
precision mediump float;
in vec3 fragColor;
in vec2 xy;

uniform vec2 minPos;
uniform vec2 maxPos;

out vec4 outColor;

void main() {
    if (xy.x < minPos.x || maxPos.x < xy.x || xy.y < minPos.y || maxPos.y < xy.y) {
        discard;
    }
    outColor = vec4(fragColor, 1.0);
}
