attribute vec2 aVertPos;
attribute vec2 aTexCoord;

uniform mat3 uViewMatrix;
uniform mat3 uModelMatrix;

varying vec2 vTexCoord;

void main(void) {
   vTexCoord = aTexCoord;
   vec3 homVertPos = vec3(aVertPos, 1.0);
   vec3 trans = uViewMatrix * uModelMatrix * homVertPos;
   gl_Position = vec4(trans.xy, 0.0, 1.0);
}
