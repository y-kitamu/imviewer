#version 300 es
layout (location=0) in vec3 aPos;
layout (location=1) in vec3 aColor;
layout (location=2) in vec3 aDirection;

uniform mat4 mvp;
uniform float scale;

out vec3 geomColor;
out vec3 geomDirection;

void main() {
    geomColor = aColor;
    geomDirection = (mvp * vec4(aDirection, 0.0)).xyz / scale;
    gl_Position = mvp * vec4(aPos, 1.0) / scale;
}
