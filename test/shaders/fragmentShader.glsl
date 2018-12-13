#version 300 es

precision mediump float;

in vec2 vTextureCoord;
in vec3 vSurfaceNormal;
in vec3 vToLight;

uniform sampler2D uTexture;
uniform vec3 uLightColor;

layout(location = 0) out vec4 vColor;

void main() {
	vec3 normalizedNormal = normalize(vSurfaceNormal);
	vec3 normalizedToLight = normalize(vToLight);

	// The dot product will give how much different are the directions in which the vectors are pointing.
	float brightness = dot(normalizedNormal, normalizedToLight);
	// The dot product might result in a negative value, so set the minimum value to be 0.
	brightness = max(brightness, 0.0);

	vec3 diffuse = brightness * uLightColor;

	vColor = vec4(diffuse, 1.0) * texture(uTexture, vTextureCoord);
}
