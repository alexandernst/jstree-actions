(function ($, undefined) {
	"use strict";

	$.jstree.defaults.actions = $.noop;

	$.jstree.plugins.actions = function (options, parent) {

		this._actions = {};

		/**
		 * @param node_id Can be a single node id or an array of node ids.
		 * @param action An object representing the action that should be added to <node>.
		 *
		 * The <node id> is the "id" key of each element of the "core.data" array.
		 * A special value "all" is allowed, in which case the action will be added to all nodes.
		 *
		 * The actions object can contain the following keys:
		 * id       <- string An ID which identifies the action. The same ID can be shared across different nodes
		 * text     <- string The action's text
		 * class    <- string (a string containing all the classes you want to add to the action (space separated)
		 * selector <- a selector that would specify where to insert the action.
		 * after    <- bool (insert the action after (true) or before (false) the element matching the <selector> key
		 * event    <- string The event on which the trigger will be called
		 * callback <- function that will be called when the action is clicked
		 *
		 * NOTES: Please keep in mind that:
		 * - the id's are strictly compared (===)
		 * - the selector has access to all children on nodes with leafs/children, so most probably you'd want to use :first or similar
		 */
		this.add_action = function (node_id, action) {
			var self = this;
			node_id = typeof node_id === Object ? node_id : [node_id];

			console.log("before add", this._actions);

			$.each(node_id, function (nidx, node_id) {
				if (self._actions[node_id] === undefined) {
					self._actions[node_id] = [];
				}

				var action_exists = false;
				$.each(self._actions[node_id], function (aidx, av) {
					if (av.id === action.id) action_exists = true;
				});

				if (!action_exists) self._actions[node_id].push(action);
			});

			console.log("after add", this._actions);

			//TODO: Redraw only the modified nodes?
			this.redraw(true);
		};

		/**
		 * @param node_id Can be a single node id or an array of node ids
		 * @param action_id The ID of the action to be removed
		 *
		 * The <node id> is the "id" key of each element of the "core.data" array.
		 * A special value "all" is allowed, in which case the action_id will be removed from all nodes.
		 *
		 * The action_id is the unique identifier for each action.
		 * A special value "all" is allowed, in which case all the actions of node_id will be removed.
		 */
		this.remove_action = function (node_id, action_id) {
			var self = this;
			var node_ids = typeof node_id === Object ? node_id :
				node_id === "all" ? Object.keys(this._actions) :
					[node_id];

			console.log("before remove", this._actions);

			$.each(node_ids, function (nidx, node_id) {
				var actions = self._actions[node_id] || [];
				var new_actions = [];
				$.each(actions, function (aidx, action) {
					if(action.id !== action_id && action_id !== "all") {
						new_actions.push(action);
					}
				});
				self._actions[node_id] = new_actions;
			});

			console.log("after remove", this._actions);

			//TODO: Redraw only the modified nodes?
			this.redraw(true);
		};

		this._get_action = function (node_id, action_id) {
			var actions = this._actions[node_id] || [];
			var v = null;
			$.each(actions, function (index, value) {
				if (value.id === action_id) {
					//TODO: fill empty fields
					v = value;
				}
			});
			return v;
		};

		this._create_action = function (node_id, action_id) {
			var self = this;
			var action = this._get_action(node_id, action_id);
			if (action === null) return null;

			var action_el = $('<i>');
			$(action_el)
				.addClass(action.class)
				.text(action.text)
				.attr(action_id, "")
				.on(action.event, function() {
					var node = self.get_node($(action_el));
					action.callback(node_id, node, action_id, action_el);
				});
			return {
				"action": action,
				"action_el": action_el
			};
		};

		this._set_action = function (node_id, obj, action) {
			if (action === null) return;

			if (action.action.after) {
				$(action.action_el).insertAfter( $(action.action.selector, $(obj)) );
			} else {
				$(action.action_el).insertBefore( $(action.action.selector, $(obj)) );
			}
		};

		this._has_action = function (obj, action_id) {
			var attr = $(obj).attr(action_id);
			return (attr !== undefined) && (attr !== false);
		};

		this.redraw_node = function (obj, deep, callback, force_draw) {
			var self = this;
			var node_id = obj;
			var el = parent.redraw_node.call(this, obj, deep, callback, force_draw);
			if (el) {
				//Check if we have any specific actions for this node
				var actions = this._actions[node_id] || [];

				$.each(actions, function (index, action) {
					//console.log("Adding " + action.id + " to object ", el);
					if (self._has_action(el, action.id)) return;
					var _action = self._create_action(node_id, action.id);
					self._set_action(node_id, el, _action);
				});

				//Check if we have any global actions
				actions = this._actions["all"] || [];

				$.each(actions, function (index, action) {
					//console.log("Adding " + action.id + " to object ", el);
					if (self._has_action(el, action.id)) return;
					var _action = self._create_action("all", action.id);
					self._set_action(node_id, el, _action);
				});
			}
			return el;
		};

	}

})(jQuery);