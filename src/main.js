//#INCLUDE "src/loader.js"

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

      // Bind shader variables
      shader.attrib = {};

      shader.attrib.vertPos = gl.getAttribLocation(shader, "aVertPos");
      gl.enableVertexAttribArray(shader.attrib.vertPos);

      // Set up our display
      gl.useProgram(shader);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Export some stuff
      VIOL.canvas = canvas;
      VIOL.shader = shader;
   });
});

function drawSprite(img, x, y) {
   // First we need to make an array of the corners
   var w = 2*img.width/VIOL.canvas.width;
   var h = 2*img.height/VIOL.canvas.height;

   var verts = [
      x,   y,   0,
      x+w, y,   0,
      x,   y+h, 0,
      x+w, y+h, 0
   ];

   // Make a buffer
   vertBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);

   // Buffer the data
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

   // Bind it to the attribute
   gl.vertexAttribPointer(VIOL.shader.attrib.vertPos, 3, gl.FLOAT, false, 0, 0);

   // Draw
   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

   //Unbind the buffer
   gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
