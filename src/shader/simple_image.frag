#version 300 es
precision mediump float;
in vec2 texCoord;
uniform sampler2D imageTexture;

out vec4 outColor;

void main() {
    outColor = texture(imageTexture, texCoord);
}
