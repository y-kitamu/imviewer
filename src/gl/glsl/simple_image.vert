#version 300 es
layout (location=0) in vec3 aPos; // coordinate in pixel space.
layout (location=1) in vec2 aTexCoord;

uniform mat4 mvp[1];

out vec2 texCoord;
out vec2 xy;

void main() {
    texCoord = aTexCoord;
    gl_Position = mvp[0] * vec4(aPos, 1.0);
    xy = gl_Position.xy;
}
