import makeQuerySelector from './Selector';

export default (name: string, args: string): string => {
	switch (name) {
		//// filtering ////
		// .first()
		case 'first': return '%_%[0]';
		
		// .last()
		case 'last': return 'Array.from(%_%).slice(-1)[0]';
		
		// .eq()
		case 'eq': return `Array.from(%_%).slice(${args})[0]`;

		// .slice()
		case 'slice': return `Array.from(%_%).slice(${args})`;

		// .even()
		case 'even': return `Array.from(%_%).filter((e, i) => i % 2 === 0)`;

		// .odd()
		case 'odd': return `Array.from(%_%).filter((e, i) => i % 2 === 1)`;

		// .filter()
		case 'filter': {
			/*
			let regex: RegExp = /(?:function[\s\n]*\([\s\n]*(\w+)?[\s\n]*,?[\s\n]*(\w+)?[\s\n]*\)|\([\s\n]*(\w+)[\s\n]*,[\s\n]*(\w+)[\s\n]*\)[\s\n]*=>)[\s\n]*{?((?:.|\n)*?)}?\)/g;
			let match: string[] = [...args.matchAll(regex)][0];
			if (match) {
				if (match[1]) {
					if (match[5]) {
						return `Array.from(%_%).filter(function (${match[2] || '_'}, ${match[1]}) {${match[6]}})`
					} else {
						return `Array.from(%_%).filter(function (${match[2] || '_'}, ${match[1]}) ${match[6]})`
					}
				} else if (match[3]) {
					if (match[5]) {
						return `Array.from(%_%).filter((${match[4] || '_'}, ${match[3]}) => {${match[6]}})`
					} else {
						return `Array.from(%_%).filter((${match[4] || '_'}, ${match[3]}) => ${match[6]})`
					}
				}
			}
			*/

			let regex: RegExp = /(?:\$|jQuery)\((.*["'`] *)\)/g;
			let match: string[] = [...args.matchAll(regex)][0];
			if (match) {
				if (~args.indexOf('#')) return `document.${makeQuerySelector(match[1])}`;
				return `Array.from(%_%).map(e => ${makeQuerySelector(match[1])})`;
			}

			if (~args.indexOf('#')) return `document.${makeQuerySelector(args)}`;
			return `Array.from(%_%).map(e => ${makeQuerySelector(args)})`;
		}

		// .has()
		case 'has': return `Array.from(%_%).filter(e => e.children.indexOf(e.${makeQuerySelector(args)[0]})`;



		//// tree traversal ////
		// .find()
		case 'find':
			if (~args.indexOf('#')) return `document.${makeQuerySelector(args)}`;
			return `Array.from(%_%).map(e => e.${makeQuerySelector(args)})`;

		// .children()
		case 'children': return `Array.from(%_%).map(e => querySelector(":scope > ${args || '*'}"))`;

		// .parent()
		case 'parent': return `Array.from(%_%).map(e => parentNode)`;

		// .closest()
		case 'closest': return `Array.from(%_%).map(e => closest(${args}))`;

		// .next()
		case 'next': return `Array.from(%_%).map(e => nextElementSibling)`;

		// .prev()
		case 'prev': return `Array.from(%_%).map(e => previousElementSibling)`;

		// .siblings()
		case 'siblings': return `Array.from(%_%).map(e => parentNode.children)`;


	
		//// attributes ////
		// .addClass()
		case 'addClass': return `Array.from(%_%).forEach(e => e.classList.add(${args}))`;

		// .removeClass()
		case 'removeClass': return `Array.from(%_%).forEach(e => e.classList.remove(${args}))`;

		// .toggleClass()
		case 'toggleClass': return `Array.from(%_%).forEach(e => e.classList.toggle(${args}))`;

		// .hasClass()
		case 'hasClass': return `%_%.some(e => e.classList.contains(${args}))`;

		// .attr()
		case 'attr':
			if (args.split(',').length === 1) return `%_%[0].getAttribute(${args})`;
			if (args.split(',').length === 2) return `Array.from(%_%).forEach(e => e.setAttribute(${args.split(',')[0]}) = ${args.split(',')[1]})`;
			break;

		// .prop()
		case 'prop':
			if (args.split(',').length === 1) return `%_%[0].${args.replace(/["'`]/g,'')}`;
			if (args.split(',').length === 2) return `Array.from(%_%).forEach(e => e.${args.split(',')[0].replace(/["'`]/g,'')} = ${args.split(',')[1]})`;
			break;

		// .removeAttr()
		// .removeProp()
		case 'removeAttr':
		case 'removeProp':
			return `Array.from(%_%).forEach(e => e.removeAttribute(${args}))`;

		// .html()
		case 'html': return args ? `Array.from(%_%).forEach(e => e.innerHTML = ${args})` : `%_%[0].innerHTML`;

		// .val()
		case 'val': return args ? `Array.from(%_%).forEach(e => e.value = ${args})` : `%_%[0].value`;

		// .text()
		case 'text': return args ? `Array.from(%_%).forEach(e => e.innerText = ${args})` : `Array.from(%_%).map(e => e.innerText).join('')`;



		//// manipulation ////
		// .append()
		case 'append': return `Array.from(%_%).forEach(e => e.append(${args}))`;

		// .appendTo()
		case 'appendTo': return `Array.from(document.${makeQuerySelector(args)}).forEach(e => e.append(%_%))`;

		// .after()
		case 'after': return `Array.from(%_%).forEach(e => e.insertAdjacentHTML("afterend", ${args}.outerHTML))`;

		// .insertAfter()
		case 'insertAfter': return `Array.from(document.${makeQuerySelector(args)}).forEach(e => e.insertAdjacentHTML("afterend", %_%.outerHTML))`;

		// .prepend()
		case 'prepend': return `Array.from(%_%).forEach(e => e.prepend(${args}))`;

		// .prependTo()
		case 'prependTo': return `Array.from(document.${makeQuerySelector(args)}).forEach(e => e.prepend(%_%))`;

		// .before()
		case 'before': return `Array.from(%_%).forEach(e => e.insertAdjacentHTML("beforebegin", ${args}.outerHTML))`;

		// .insertBefore()
		case 'insertBefore': return `Array.from(document.${makeQuerySelector(args)}).forEach(e => e.insertAdjacentHTML("beforebegin", %_%.outerHTML))`;

		// .remove()
		case 'remove': return `Array.from(%_%).forEach(e => e.remove())`;

		// .empty()
		case 'empty': return `%_%.innerHTML = ""`;

		// .replaceWith()
		case 'replaceWith': return `Array.from(%_%).forEach(e => e.outerHTML = ${args})`;

		// .replaceAll()
		case 'replaceAll': return `Array.from(document.${makeQuerySelector(args)}).forEach(e => e.outerHTML = %_%)`;

		// .width()
		case 'width': return args ? `Array.from(%_%).forEach(e => e.style.width = ${Boolean(Number(args)) ? `"${args}px"` : args})` : `%_%[0].style.width`;

		// .innerWidth()
		case 'innerWidth': return args ? `Array.from(%_%).forEach(e => e.style.width = ${Boolean(Number(args)) ? `"${args}px"` : args})` : `%_%[0].clientWidth`;

		// .outerWidth()
		case 'outerWidth': return args ? `Array.from(%_%).forEach(e => e.style.width = ${Boolean(Number(args)) ? `"${args}px"` : args})` : `%_%[0].offsetWidth`;

		// .height()
		case 'height': return args ? `Array.from(%_%).forEach(e => e.style.height = ${Boolean(Number(args)) ? `"${args}px"` : args})` : `%_%[0].style.height`;

		// .innerHeight()
		case 'innerHeight': return args ? `Array.from(%_%).forEach(e => e.style.height = ${Boolean(Number(args)) ? `"${args}px"` : args})` : `%_%[0].clientHeight`;

		// .outerHeight()
		case 'outerHeight': return args ? `Array.from(%_%).forEach(e => e.style.height = ${Boolean(Number(args)) ? `"${args}px"` : args})` : `%_%[0].offsetHeight`;

		// .scrollLeft()
		case 'scrollLeft': return args ? `Array.from(%_%).forEach(e => e.scrollLeft = ${args})` : `%_%[0].scrollLeft`;

		// .scrollTop()
		case 'scrollTop': return args ? `Array.from(%_%).forEach(e => e.scrollTop = ${args})` : `%_%[0].scrollTop`;

		// .css()
		case 'css': return args.split(',')[1]
				? `Array.from(%_%).forEach(e => e.style.${
					args.split(',')[0].replace(/["'`]/g, '').replace(/-(\w)/g, (v, p) => p.toUpperCase())
				} = ${args.split(',')[1]})`
				: `%_%[0].style.${args.split(',')[0].replace(/["'`]/g, '').replace(/-(\w)/g, (v, p) => p.toUpperCase())}`;
	}
	return '';
};
