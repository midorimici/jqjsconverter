export default (name: string, args: string): string => {
	//// filtering ////
	// .first()
	if (name === 'first') return '_[0]';
	
	// .last()
	if (name === 'last') return 'Array.from(_).slice(-1)[0]';
	
	// .eq()
	if (name === 'eq') return `Array.from(_).slice(${args})[0]`;

	// .slice()
	if (name === 'slice') return `Array.from(_).slice(${args})`;

	// .even()
	if (name === 'even') return `Array.from(_).filter((e, i) => i % 2 === 0)`;

	// .odd()
	if (name === 'odd') return `Array.from(_).filter((e, i) => i % 2 === 1)`;

	// .not()
	if (name === 'not') {
		let regex: RegExp = /function[\s\n]*\([\s\n]*(\w+)[\s\n]*,[\s\n]*(\w+)[\s\n]*\)[\s\n]*{[\s\n]*/g
	}



	return ''
};
