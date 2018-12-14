#version 300 es

// Attribute variables
layout(location = 0) in vec3 aVertexPosition;
layout(location = 1) in vec2 aTextureCoord;
layout(location = 2) in vec3 aNormal;

uniform mat4 uTransformationMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform vec3 uLightPosition;

// Varying variables
out vec2 vTextureCoord;
out vec3 vSurfaceNormal;
out vec3 vToLight;
out vec3 vToCamera;

void main() {
	// The position after being translated and rotated
	vec4 realPosition = uTransformationMatrix * vec4(aVertexPosition, 1.0);

	gl_Position = uProjectionMatrix * uViewMatrix * realPosition;
	vTextureCoord = aTextureCoord * 40.0;

	// The position of the object might be rotated because of the transformation matrix, so the normal should also be rotated.
	vSurfaceNormal = (uTransformationMatrix * vec4(aNormal, 0.0)).xyz;
	// The vector from the object position to the light source position.
	vToLight = uLightPosition - realPosition.xyz;
	// The vector from the object position to the camera (the view matrix contains an the inverted position of the camera)
	vToCamera = (inverse(uViewMatrix) * vec4(0.0, 0.0, 0.0, 1.0)).xyz - realPosition.xyz;
}
