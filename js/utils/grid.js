function superGrid(tag) {
	this.tag = tag;
	this.grids = [];

	this.addGrid = function(grid) {
		this.grids.push(grid);
	};

	this.generate = function() {
		var superGrid = generateHtmlTag(tag);
		sortByOrder(this.grids);
		$.each(this.grids, function(index, grid) {
			superGrid.append(grid.generate());
		});
		return superGrid;
	};
};

function grid(tag) {
	this.tag = tag;
	this.order = -1;
	this.elements = [];

	this.addElement = function(element) {
		this.elements.push(element);
	};

	this.generate = function() {
		var grid = generateHtmlTag(this.tag);
		sortByOrder(this.elements);
		$.each(this.elements, function(index, element) {
			grid.append(element.generate());
		});
		return grid;
	};
};

function gridElement(tag, order) {
	this.tag = tag;
	this.order = order;
	this.items = [];

	this.addItem = function(item) {
		this.items.push(item);
	};

	this.generate = function() {
		var element = generateHtmlTag(this.tag);
		sortByOrder(this.items);
		$.each(this.items, function(index, item) {
			element.append(item.generate());
		});
		return element;
	};
};

function gridElementItem(tag, order, content) {
	this.tag = tag;
	this.order = order;
	this.content = content;

	this.generate = function() {
		var item = generateHtmlTag(this.tag);
		item.append(content);
		return item;
	};
};

function tag(name, id, clazz, title) {
	this.name = name;
	this.id = id;
	this.clazz = clazz;
	this.title = title;
};


/**
 * UTILS
 */

function sortByOrder(arrayToSort) {
	arrayToSort.sort(function(item1, item2) {
		return item1.order - item2.order;
	});
};

function generateHtmlTag(tag) {
	var html = '<'+tag.name;
	if(undefined !== tag.id && null !== tag.id) {
		html += ' id="'+tag.id+'"';
	}
	if(undefined !== tag.clazz && null !== tag.clazz) {
		html += ' class="'+tag.clazz+'"';
	}
	if(undefined !== tag.title && null !== tag.title) {
		html += ' title="'+tag.title+'"';
	}
	html += '></'+tag.name+'>';
	return $(html);
};