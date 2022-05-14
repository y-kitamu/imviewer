#version 300 es
precision mediump float;
in vec3 fragColor;
in vec2 xy;
flat in int vertexId;

uniform vec2 minPos[2];
uniform vec2 maxPos[2];

out vec4 outColor;

void main() {
    int idx = vertexId % 2;
    if (xy.x < minPos[idx].x || maxPos[idx].x < xy.x ||
        xy.y < minPos[idx].y || maxPos[idx].y < xy.y) {
        discard;
    }
    outColor = vec4(fragColor, 1.0);
}
