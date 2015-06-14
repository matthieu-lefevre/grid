function superGrid(markup) {
	this.markup = markup;
	this.grids = [];

	this.addGrid = function(grid) {
		this.grids.push(grid);
	};

	this.generate = function() {
		var superGrid = generateHtmlMarkup(this.markup);
		sortByOrder(this.grids);
		$.each(this.grids, function(index, grid) {
			superGrid.append(grid.generate());
		});
		return superGrid;
	};
};

function grid(markup) {
	this.markup = markup;
	this.order = -1;
	this.elements = [];

	this.addElement = function(element) {
		this.elements.push(element);
	};

	this.generate = function() {
		var grid = generateHtmlMarkup(this.markup);
		sortByOrder(this.elements);
		$.each(this.elements, function(index, element) {
			grid.append(element.generate());
		});
		return grid;
	};
};

function gridElement(markup, order) {
	this.markup = markup;
	this.order = order;
	this.items = [];

	this.addItem = function(item) {
		this.items.push(item);
	};

	this.generate = function() {
		var element = generateHtmlMarkup(this.markup);
		sortByOrder(this.items);
		$.each(this.items, function(index, item) {
			element.append(item.generate());
		});
		return element;
	};
};

function gridElementItem(markup, order, content) {
	this.markup = markup;
	this.order = order;
	this.content = content;

	this.generate = function() {
		var item = generateHtmlMarkup(this.markup);
		item.append(this.content);
		return item;
	};
};

function markup(tag, id, clazz, title) {
	this.tag = tag;
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

function generateHtmlMarkup(markup) {
	var html = '<'+markup.tag;
	if(undefined !== markup.id && null !== markup.id) {
		html += ' id="'+markup.id+'"';
	}
	if(undefined !== markup.clazz && null !== markup.clazz) {
		html += ' class="'+markup.clazz+'"';
	}
	if(undefined !== markup.title && null !== markup.title) {
		html += ' title="'+markup.title+'"';
	}
	html += '></'+markup.tag+'>';
	return $(html);
};