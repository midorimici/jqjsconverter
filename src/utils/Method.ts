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
				return `%_%.map(e => ${makeQuerySelector(match[1])})`;
			}

			return `%_%.map(e => ${makeQuerySelector(args)})`;
		}

		// .has()
		case 'has': return `Array.from(%_%).filter(e => e.children.indexOf(e.${makeQuerySelector(args)[0]})`;



		//// tree traversal ////
		// .find()
		case 'find': return `%_%.map(e => e.${makeQuerySelector(args)})`;

		// .children()
		case 'children': return `%_%.map(e => querySelector(":scope > ${args || '*'}"))`;

		// .parent()
		case 'parent': return `%_%.map(e => parentNode)`;

		// .closest()
		case 'closest': return `%_%.map(e => closest(${args}))`;

		// .next()
		case 'next': return `%_%.map(e => nextElementSibling)`;

		// .prev()
		case 'prev': return `%_%.map(e => previousElementSibling)`;

		// .siblings()
		case 'siblings': return `%_%.map(e => parentNode.children)`;


	
		//// attributes ////
		// .addClass()
		case 'addClass': return `%_%.forEach(e => e.classList.add(${args}))`;

		// .removeClass()
		case 'removeClass': return `%_%.forEach(e => e.classList.remove(${args}))`;

		// .toggleClass()
		case 'toggleClass': return `%_%.forEach(e => e.classList.toggle(${args}))`;

		// .hasClass()
		case 'hasClass': return `%_%.some(e => e.classList.contains(${args}))`;

		// .attr()
		case 'attr':
			if (args.split(',').length === 1) return `%_%[0].getAttribute(${args})`;
			if (args.split(',').length === 2) return `%_%.forEach(e => e.getAttribute(${args[0]}) = ${args[1]})`;
			break;

		// .removeAttr()
		case 'removeAttr': return `%_%.forEach(e => e.removeAttribute(${args}))`;

		// .html()
		case 'html': return args ? `%_%.forEach(e => e.innerHTML = ${args})` : `%_%[0].innerHTML`;

		// .val()
		case 'val': return args ? `%_%.forEach(e => e.value = ${args})` : `%_%[0].value`;


		default: return '';
	}
};
