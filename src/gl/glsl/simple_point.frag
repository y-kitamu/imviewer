#version 300 es
precision mediump float;
in vec3 fragColor;

out vec4 outColor;

void main() {
    // outColor = vec4(fragColor, 1.0);
    outColor = vec4(1.0, 1.0, 0.0, 0.5);
}
