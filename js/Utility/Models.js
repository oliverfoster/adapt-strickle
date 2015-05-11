define(function() {
	return pub = {
		getDescendantsFlattened: function(id, parentFirst) {
			var model = Adapt.findById(id);
			if (model === undefined) return undefined;

			var descendants = [];

			var modelStructureType = StructureType.fromString(model.get("_type"));
			var isLastType = (modelStructureType._level === StructureType.levels);

			if (isLastType) {
				descendants.push(model);
				return new Backbone.Collection(descendants);
			}

			var children = model.getChildren();

			for (var i = 0, l = children.models.length; i < l; i++) {

				var child = children.models[i];

				var modelStructureType = StructureType.fromString(child.get("_type"));
				var isLastType = (modelStructureType._level === StructureType.levels);

				if (isLastType) {

					descendants.push(child);

				} else {

					var subDescendants = pub.getDescendantsFlattened(child.get("_id"), parentFirst);
					if (parentFirst == true) descendants.push(child);
					descendants = descendants.concat(subDescendants.models);
					if (parentFirst != true) descendants.push(child);

				}

			}

			return new Backbone.Collection(descendants);
		},

		findRelative: function(model, relativeString) {
			//return a model relative to the specified one
			var page;
			if (model.get("_type") == "page") page = model;
			else page = model.getAncestor("pages");

			var pageId = page.get("_id");
			var pageDescendants = pub.getDescendantsFlattened(pageId).toJSON();

			function parseRelative(relativeString) {
				var type = relativeString.substr(0, _.indexOf(relativeString, " "));
				var offset = parseInt(relativeString.substr(type.length));
				type = type.substr(1);

				/*RETURN THE TYPE AND OFFSET OF THE SCROLLTO
				* "@component +1"  : 
				* {
				*       type: "component",
				*       offset: 1
				* }
				*/
				return { 
					type: type,
					offset: offset
				};
			}

			function getTypeOffset(model) {
				var modelType = StructureType.fromString(model.get("_type"));

				//CREATE HASH FOR MODEL OFFSET IN PARENTS ACCORDING TO MODEL TYPE
				var offsetCount = {};
				for (var i = modelType._level - 1, l = 0; i > l; i--) {
					offsetCount[StructureType.fromInt(i)._id] = -1;
				}

				return offsetCount;
			}

			var pageDescendantIds = _.pluck(pageDescendants, "_id");

			var modelId = model.get("_id");
			var fromIndex = _.indexOf( pageDescendantIds, modelId );

			var typeOffset = getTypeOffset(model);
			var relativeInstructions = parseRelative(relativeString);

			for (var i = fromIndex +1, l = pageDescendants.length; i < l; i++) {
				var item = pageDescendants[i];

				if (!typeOffset[item._type]) typeOffset[item._type] = 0;

				typeOffset[item._type]++;

				if (typeOffset[relativeInstructions.type] >= relativeInstructions.offset) {
					if (!$("."+item._id).is(":visible")) {
						//IGNORE VISIBLY HIDDEN ELEMENTS
						relativeInstructions.offset++;
						continue;
					}

					return Adapt.findById(item._id);
				}
			}

			return undefined;
		}
	};

});