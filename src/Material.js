//#IFNDEF __HAMSTERJAM_VIOL_MATERIAL
//#DEFINE __HAMSTERJAM_VIOL_MATERIAL

if (!VIOL) var VIOL = {};

(function() {
   // This really is just equivalent to an array, the only reason
   // it exists at the moment is if I want to expand it later (probably
   // to track any Sprite that uses it)
   function Material(... textures) {
      this.textures = textures;
   }

   Material.prototype = {
      get w() {
         return textures[0].w;
      },

      get h() {
         return texture[1].h;
      }
   };

   // Export
   VIOL.Material = Material;
})();

//#ENDIF
