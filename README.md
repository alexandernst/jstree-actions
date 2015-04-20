# jstree-actions

[jstree](http://www.jstree.com/) plugin that allows adding actions on each node.

An action is, usually, but not limited to, a button that can be placed anywhere in the row of a node in jstree.

The most common example is a typical set of common actions (add and remove) on each node.

![Screenshot](https://github.com/alexandernst/jstree-actions/raw/master/screenshot.png)

There are 2 public methods that you can use to add and remove actions on each node or to all nodes at once.

`add_action (node_id, action)`

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

`remove_action (node_id, action_id)`

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

## Examples

### Add a "remove" action to all nodes

	container.jstree(true).add_action("all", {
		"id": "action_remove",
		"class": "action_remove pull-right",
		"text": "",
		"after": true,
		"selector": "a:first",
		"event": "click",
		"callback": function(node_id, node, action_id, action_el){
			console.log("callback", node_id, action_id);
		}
	});

### Add an "add" action to a particular node

	container.jstree(true).add_action("1", {
		"id": "action_add",
		"class": "action_add pull-right",
		"text": "",
		"after": true,
		"selector": "a:first",
		"event": "click",
		"callback": function(node_id, node, action_id, action_el){
			console.log("callback", node_id, action_id);
		}
	});

### Remove all actions from the node with id `1`

	container.jstree(true).remove_action("1", "all");
	
### Remove the `action_remove` action from all nodes
	
	container.jstree(true).remove_action("all", "action_remove");
	
## Compatibility

This  plugin is compatible with `jstree 3.1.0`. I haven't tested it with
any other version, but it will most probably work as it's not doing anything
too complex.

On  the other side, it's compatible with any browser at least as decent as IE9.
If you really want this to work with IE8 or any other old browser, try [ES5-shim](https://github.com/es-shims/es5-shim),
but I really can't promise you anything.

I will accept patches to fix compatibility for older browser, but I will *not*
work on that.
	
## NPM

You can get a copy of this library at [npm](https://www.npmjs.com/package/jstree-actions).

## Minify

Min version is created with [refresh-sf](http://refresh-sf.com/)
