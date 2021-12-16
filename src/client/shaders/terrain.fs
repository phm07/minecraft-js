#version 300 es

precision highp float;

in vec3 vTexCoord;
in float vBrightness;
in float vFog;

uniform highp sampler2DArray uTexture;

out vec4 outColor;

void main() {
    outColor = vec4(vec3(vBrightness), 1.0) * texture(uTexture, vTexCoord);
    outColor = mix(outColor, vec4(131.0/255.0, 226.0/255.0, 252.0/255.0, 1.0), vFog);
}