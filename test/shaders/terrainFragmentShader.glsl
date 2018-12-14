#version 300 es

#define MINUMUM_LIGHT 0.2

precision mediump float;

in vec2 vTextureCoord;
in vec3 vSurfaceNormal;
in vec3 vToLight;
in vec3 vToCamera;

uniform sampler2D uTexture;
uniform vec3 uLightColor;
uniform float uShineDamper;
uniform float uReflectivity;

layout(location = 0) out vec4 vColor;

void main() {
	vec3 normalizedNormal = normalize(vSurfaceNormal);
	vec3 normalizedToLight = normalize(vToLight);

	// The dot product will give how much different are the directions in which the vectors are pointing.
	float brightness = dot(normalizedNormal, normalizedToLight);
	// The dot product might result in a negative value, so set the minimum value to be 0.
	brightness = max(brightness, MINUMUM_LIGHT);

	vec3 diffuse = brightness * uLightColor;

	vec3 normalizedToCamera = normalize(vToCamera);
	vec3 lightDirection = -normalizedToLight;
	vec3 reflectedLightDirection = reflect(lightDirection, normalizedNormal);

	float specularFactor = dot(reflectedLightDirection, normalizedToCamera);
	specularFactor = max(specularFactor, 0.0);
	float dampedFactor = pow(specularFactor, uShineDamper);
	vec3 specularLight = dampedFactor * uReflectivity * uLightColor;

	vColor = vec4(diffuse, 1) * texture(uTexture, vTextureCoord) + vec4(specularLight, 1.0);
}
