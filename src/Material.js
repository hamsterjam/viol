//#IFNDEF __HAMSTERJAM_VIOL_MATERIAL
//#DEFINE __HAMSTERJAM_VIOL_MATERIAL

if (!VIOL) var VIOL = {};

(function() {
   // This really is just equivalent to an empty object, the only reason
   // it exists at the moment is if I want to expand it later (probably
   // to track any Sprite that uses it)
   function Material() {
      this.textures = {};
   }

   Material.prototype.bindTexture = function(texture, name) {
      this.textures[name] = texture;
   };

   Material.prototype.getTexture = function(name) {
      return this.textures[name];
   };

   // Export
   VIOL.Material = Material;
})();

//#ENDIF
