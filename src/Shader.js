//#IFNDEF __HAMSTERJAM_VIOL_SHADER
//#DEFINE __HAMSTERJAM_VIOL_SHADER

if (!VIOL) var VIOL = {};

(function() {
   function Shader(vertSrc, fragSrc, numAttribs) {
      // Compile vertex shader
      var vShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vShader, vertSrc);
      gl.compileShader(vShader);
      if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
         console.error(gl.getShaderInfoLog(vShader));
         throw new Error("Failed to compile vertex shader");
      }

      // Compile fragment shader
      var fShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fShader, fragSrc);
      gl.compileShader(fShader);
      if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
         console.error(gl.getShaderInfoLog(fShader));
         throw new Error("Failed to compile fragment shader");
      }

      // Make and link the shader program
      var program = gl.createProgram();
      gl.attachShader(program, vShader);
      gl.attachShader(program, fShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
         throw new Error("Failed to link shader program");
      }

      this.program = program;
      this.maxAttrib = numAttribs - 1;
   }

   Shader.prototype.enable = function() {
      // Get the maxAttrib of the current shader
      var currAttrib;
      if (gl.currShader !== undefined) {
         currAttrib = gl.currShader.maxAttrib;
      }
      else {
         currAttrib = -1;
      }
      // Enable things that need enabling
      for (let i = currAttrib+1; i <= this.maxAttrib; ++i) {
         gl.enableVertexAttribArray(i);
      }
      // Disable things that need disabling
      for (let i = this.maxAttrib; i < currAttrib; ++i) {
         gl.disableVertexAttribArray(i);
      }

      // Set the program as the active program
      gl.useProgram(this.program);
      gl.currShader = this;
   };

   Shader.prototype.attrib = function(attribName) {
      return gl.getAttribLocation(this.program, attribName);
   };

   Shader.prototype.uniform = function(uniformName) {
      return gl.getUniformLocation(this.program, uniformName);
   };

   Shader.prototype.drawSprite = function() {
      // Force this to be overriden
      throw new Error("Called virtual function from instance of Shader");
   }

   Shader.prototype.bindMaterial = function() {
      // Force this to be overriden
      throw new Error("Called virtual function from instance of Shader");
   }

   // Export
   VIOL.Shader = Shader;
})();

//#ENDIF
