#version 300 es
layout (points) in;
layout (line_strip, max_vertices=5) out;

in vec3 geomColor[];
in vec3 geomDirection[];

out vec4 fragColor;


int main() {
    float rad = cos(radians(45.0));
    vec3 dir = geomDirection[0];
    mat3 rot0 = mat3(vec3(rad, rad, 0.0),
                    vec3(-rad, rad, 0.0),
                    vec3(0.0, 0.0, 1.0));
    mat3 rot1 = mat3(vec3(rad, -rad, 0.0),
                     vec3(rad, rad, 0.0),
                     vec3(0.0, 0.0, 1.0));
    vec4 tip = gl_in[0].gl_Position + vec4(dir, 0.0);

    // create arrow
    gl_Position = gl_in[0].gl_Position;
    fragColor = vec4(geomColor[0], 1.0);
    EmitVertex();
    gl_Position = tip;
    fragColor = vec4(geomColor[0], 1.0);
    EmitVertex();
    gl_Position = tip - 0.2 * vec4(rot0 * dir, 0.0);
    fragColor = vec4(geomColor[0], 1.0);
    EmitVertex();
    gl_Position = tip - 0.2 * vec4(rot1 * dir, 0.0);
    fragColor = vec4(geomColor[0], 1.0);
    EmitVertex();
    gl_Position = tip;
    fragColor = vec4(geomColor[0], 1.0);
    EmitVertex();
    EmitPrimitive();
}
