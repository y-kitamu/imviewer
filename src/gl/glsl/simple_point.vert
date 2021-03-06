#version 300 es
layout (location=0) in vec3 aPos;
layout (location=1) in vec3 aColor;

uniform mat4 mvp[1];

out vec3 fragColor;
out vec2 xy;

void main() {
    fragColor = aColor;
    gl_Position = mvp[0] * vec4(aPos, 1.0);
    gl_PointSize = 10.0;
    xy = gl_Position.xy;
}
