/*
* adapt-trickle
* License - http://github.com/adaptlearning/adapt_framework/LICENSE
* Maintainers - Oliver Foster <oliver.foster@kineo.com>
*/

define([
	'coreModels/adaptModel',
	'./Defaults/FullWidthButtonDefaults'
	], function(AdaptModel, FullWidthButtonDefaults) {

	var TrickleButtonModel = AdaptModel.extend({
		
		initialize: function(options) {
			if (options.trickleConfig === undefined) return;
			if (options.parentModel === undefined) return;

			var parentModel = options.parentModel;
			var trickleConfig = options.trickleConfig;

			var isFullWidth = (trickleConfig._button._isFullWidth);
			if (isFullWidth) {
				//setup configuration with FullWidth type defaults
				$.extend(true, trickleConfig, FullWidthButtonDefaults);
			}

			this.set({
				_isTrickleInteractiveComponent: true,
				_id: "trickle-button-"+parentModel.get("_id"),
				_type: "component",
				_component: "trickle-button",
				//turn off accessibility state for button component
				_classes: "no-state" + (isFullWidth ? " trickle-full-width" : ""),
				_layout: "full",
				_parentId: parentModel.get("_id"),
				_parentType: parentModel.get("_type"),
				_parentComponent: parentModel.get("_component"),
				_trickle: trickleConfig,
				_isVisible: true,
				_isAvailable: true,
				_isEnabled: true,
				_isLocking: trickleConfig._isLocking,
				_isComplete: trickleConfig._isInteractionComplete,
				_isInteractionComplete: trickleConfig._isInteractionComplete,
				_index: trickleConfig._index
			});

		}

	});

	return TrickleButtonModel;

});