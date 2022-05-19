#version 300 es
precision mediump float;
in vec2 texCoord;
in vec2 xy;
uniform sampler2D imageTexture;
uniform vec2 minPos[1];
uniform vec2 maxPos[1];

out vec4 outColor;

void main() {
    if (xy.x < minPos[0].x || maxPos[0].x < xy.x || xy.y < minPos[0].y || maxPos[0].y < xy.y) {
        discard;
    }
    outColor = texture(imageTexture, texCoord);
}
