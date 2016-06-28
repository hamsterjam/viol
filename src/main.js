//#INCLUDE "src/loader.js"
//#INCLUDE "src/Mat3.js"
//#INCLUDE "src/Texture.js"

if (!VIOL) var VIOL = {};
if (!gl) var gl = {};

document.addEventListener('DOMContentLoaded', function() {
   // First we are going to load resources so we can get the config
   VIOL.load("manifest.json", function(res) {
      // I'm not going to go any more layers deep, no callback pyramid today!
      VIOL.res = res;

      // Make the canvas
      var canvas = document.createElement("canvas");
      canvas.width = res.config.width;
      canvas.height = res.config.height;
      document.body.appendChild(canvas);

      // Create our WebGL context
      gl = canvas.getContext("webgl");

      // Build the vertex shader
      var vShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vShader, VIOL.res.vertShader);
      gl.compileShader(vShader);
      if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
         console.error(gl.getShaderInfoLog(vShader));
      }

      // Build the fragment shader
      var fShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fShader, VIOL.res.fragShader);
      gl.compileShader(fShader);
      if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
         console.error(gl.getShaderInfoLog(fShader));
      }

      // Make and link the shader program
      var shader = gl.createProgram();
      gl.attachShader(shader, vShader);
      gl.attachShader(shader, fShader);
      gl.linkProgram(shader);
      if (!gl.getProgramParameter(shader, gl.LINK_STATUS)) {
         console.error("Failed to link shader");
      }

      gl.useProgram(shader);

      // Bind shader variables
      shader.attrib = {};
      shader.uniform = {};

      shader.attrib.vertPos = gl.getAttribLocation(shader, "aVertPos");
      gl.enableVertexAttribArray(shader.attrib.vertPos);

      shader.attrib.textureCoord = gl.getAttribLocation(shader, "aTextureCoord");
      gl.enableVertexAttribArray(shader.attrib.textureCoord);

      shader.uniform.texture = gl.getUniformLocation(shader, "uTexture");
      shader.uniform.modelMatrix = gl.getUniformLocation(shader, "uModelMatrix");
      shader.uniform.viewMatrix = gl.getUniformLocation(shader, "uViewMatrix");

      // Set the view matrix (this is a temporary fixed camera)
      var viewMat = VIOL.Mat3.scale(2/canvas.width, 2/canvas.height);
      viewMat = VIOL.Mat3.translate(-1, -1).mul(viewMat);
      gl.uniformMatrix3fv(shader.uniform.viewMatrix, false, viewMat.transpose().data);

      // Set up our display
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Export some stuff
      VIOL.canvas = canvas;
      VIOL.shader = shader;
   });
});

function drawSprite(tex, x, y) {
   // Generate model matrix
   var modelMat = VIOL.Mat3.translate(x, y);
   gl.uniformMatrix3fv(VIOL.shader.uniform.modelMatrix, false, modelMat.transpose().data);

   // Ask the texture politely to bind the attributes
   tex.bindAttribs(VIOL.shader.attrib.vertPos, VIOL.shader.attrib.textureCoord);

   // Bind the texture itself
   gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D, tex.tex);
   gl.uniform1i(VIOL.shader.uniform.texture, 0);

   // Draw
   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

   // Cleanup
   gl.bindTexture(gl.TEXTURE_2D, null);
}
