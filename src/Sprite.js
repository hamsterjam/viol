//#IFNDEF __HAMSTERJAM_VIOL_SPRITE
//#DEFINE __HAMSTERJAM_VIOL_SPRITE

//#INCLUDE "src/Mat3.js"

if (!VIOL) var VIOL = {};

(function() {
   function Sprite(mat, pos, anch, rot) {
      // Default parameters
      if (pos  === undefined) pos  = [0, 0];
      if (anch === undefined) anch =　[0, 0];
      if (rot  === undefined) rot  = 0;

      this.mat  = mat;
      this.pos  = pos;
      this.anch = anch;
      this.rot  = rot;

      this.matrix = VIOL.Mat3.identity();
      this.needsRebuild = true;
   }

   Sprite.prototype = {
      get transMatrix() {
         if (this.needsRebuild) {
            this.buildMat();
            this.needsRebuild = false;
         }
         return this.matrix;
      },

      set position(pos) {
         this.pos = pos;
         this.needsRebuild = true;
      },

      set rotation(rot) {
         this.rot = rot;
         this.needsRebuild = true;
      },

      set anchor(anch) {
         this.anch = anch;
         this.needsRebuild = true;
      }
   };

   Sprite.prototype.buildMat = function() {
      // Anchor
      var anchX = this.anch[0] * this.mat.w;
      var anchY = this.anch[1] * this.mat.h;

      this.matrix = VIOL.Mat3.translate(-anchX, -anchY);

      // Rotation
      this.matrix = VIOL.Mat3.rotate(this.rot).aMul(this.matrix);

      // Position
      var x = this.pos[0];
      var y = this.pos[1];

      this.matrix = VIOL.Mat3.translate(x, y).aMul(this.matrix);
   };

   Sprite.prototype.translate = function(dPos) {
      this.pos[0] += dPos[0];
      this.pos[1] += dPos[1];
      this.needsRebuild = true;
   };

   Sprite.prototype.rotate = function(dRot) {
      this.rot += dRot;
      this.needsRebuild = true;
   };

   // Export
   VIOL.Sprite = Sprite;
})();

//#ENDIF
