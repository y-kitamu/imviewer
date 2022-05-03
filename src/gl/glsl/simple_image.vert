#version 300 es
layout (location=0) in vec3 aPos; // coordinate in pixel space.
layout (location=1) in vec2 aTexCoord;

uniform mat4 mvp;
uniform float scale;

out vec2 texCoord;

void main() {
    texCoord = aTexCoord;
    gl_Position = mvp * vec4(aPos, 1.0) / scale;
}
