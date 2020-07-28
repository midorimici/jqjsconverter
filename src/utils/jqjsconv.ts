const makeQuerySelector = (s: string): string => {
	//// query selection ////
	// tag
	// div, p, button, etc...
	let match: string[] = [...s.matchAll(/(?: )*(["'`])(\w*)["'`](?: )*/g)][0];
	if (match) return `getElementsByTagName(${match[1] + match[2] + match[1]})`;
	// id
	// #id
	match = [...s.matchAll(/(?: )*(["'`])#(\w*)["'`](?: )*/g)][0];
	if (match) return `getElementById(${match[1] + match[2] + match[1]})`;
	// class
	// .foo
	match = [...s.matchAll(/(?: )*(["'`])\.(\w*)["'`](?: )*/g)][0];
	if (match) return `getElementsByClassName(${match[1] + match[2] + match[1]})`;

	//// jQuery extensions ////
	let quotSign: string = [...s.matchAll(/(?: )*(["'`]).*["'`](?: )*/g)][0][1] === `"` ? `'` : `"`;

	// [property!=value]
	match = [...s.matchAll(/(?: )*(["'`])(.*)\[(\w+)!=(\w+)\](.*)["'`](?: )*/g)][0];
	if (match) return `querySelectorAll(${match[1] + match[2]}:not([${match[3]}=${match[4]}])${match[5] + match[1]})`;

	// :file, :image, :password, :radio, :reset
	match = [...s.matchAll(/(?: )*(["'`])(.*)(?::(file|image|password|radio|reset))(.*)["'`](?: )*/g)][0];
	if (match) return `querySelectorAll(${match[1] + match[2]}[type=${quotSign + match[3] + quotSign}]${match[4] + match[1]})`;

	// :parent
	match = [...s.matchAll(/(?: )*(["'`])(.*):parent(.*)["'`](?: )*/g)][0];
	if (match) return `querySelectorAll(${match[1] + match[2]}:not(:empty)${match[3] + match[1]})`;

	// :selected
	match = [...s.matchAll(/(?: )*(["'`])(.*):selected(.*)["'`](?: )*/g)][0];
	if (match) return `querySelectorAll(${match[1] + match[2]}:checked${match[3] + match[1]})`;

	// :button
	let regex: RegExp = /(?: )*(["'`])(.*):button(.*)["'`](?: )*/g;
	match = [...s.matchAll(regex)][0];
	if (match) {
		let sticked: string[] = [...match[2].matchAll(/(?:(.*(?: |>))((?:#|\.)\w+)?|(?:#|\.)\w+)/g)][0];
		if (sticked) {
			if (sticked[2]) {
				return `querySelectorAll(${match[1] + sticked[1]}button${sticked[2] + match[3]}, ${sticked[1]}input[type=${quotSign}button${quotSign}]${sticked[2] + match[3] + match[1]})`
			} else {
				if (sticked[1]) {
					return `querySelectorAll(${match[1] + sticked[1]}button${match[3]}, ${sticked[1]}input[type=${quotSign}button${quotSign}]${match[3] + match[1]})`
				} else {
					return `querySelectorAll(${match[1]}button${sticked[0] + match[3]}, input[type=${quotSign}button${quotSign}]${sticked[0] + match[3] + match[1]})`
				}
			}
		} else {
			return `querySelectorAll(${match[1]}button${match[3]}, input[type=${quotSign}button${quotSign}]${match[3] + match[1]})`;
		}
	}

	// :submit
	regex = /(?: )*(["'`])(.*?)( |>)?:submit(.*)["'`](?: )*/g;
	match = [...s.matchAll(regex)][0];
	let spaceOrArrow: boolean = ( match || '')[3] !== undefined;
	if (match)
		return spaceOrArrow
			? `querySelectorAll(${match[1] + match[2] + match[3]}input[type=${quotSign}submit${quotSign}]${match[4]}, ${match[2] + match[3]}button[type=${quotSign}submit${quotSign}]${match[4] + match[1]})`
			: `querySelectorAll(${match[1]}input[type=${quotSign}submit${quotSign}]${match[2] + match[4]}, button[type=${quotSign}submit${quotSign}]${match[2] + match[4] + match[1]})`;

	// :text
	regex = /(?: )*(["'`])(.*?)( |>)?:text(.*)["'`](?: )*/g;
	match = [...s.matchAll(regex)][0];
	spaceOrArrow = ( match || '')[3] !== undefined;
	if (match)
		return spaceOrArrow
			? `querySelectorAll(${match[1] + match[2] + match[3]}input[type=${quotSign}text${quotSign}]${match[4]}, ${match[2] + match[3]}input:not([type])${match[4] + match[1]})`
			: `querySelectorAll(${match[1]}input[type=${quotSign}text${quotSign}]${match[2] + match[4]}, input:not([type])${match[2] + match[4] + match[1]})`;

	// :input
	regex = /(?: )*(["'`])(.*?)( |>)?:input(.*)["'`](?: )*/g;
	match = [...s.matchAll(regex)][0];
	spaceOrArrow = ( match || '')[3] !== undefined;
	if (match)
		return spaceOrArrow
			? `querySelectorAll(${match[1] + match[2] + match[3]}input${match[4]}, ${match[2] + match[3]}select${match[4]}, ${match[2] + match[3]}textarea${match[4]}, ${match[2] + match[3]}button${match[4] + match[1]})`
			: `querySelectorAll(${match[1]}input${match[2] + match[4]}, select${match[2] + match[4]}, textarea${match[2] + match[4]}, button${match[2] + match[4] + match[1]})`;

	// :header
	regex = /(?: )*(["'`])(.*?)( |>)?:header(.*)["'`](?: )*/g;
	match = [...s.matchAll(regex)][0];
	spaceOrArrow = ( match || '')[3] !== undefined;
	if (match)
		return spaceOrArrow
			? `querySelectorAll(${match[1] + match[2] + match[3]}h1${match[4]}, ${match[2] + match[3]}h2${match[4]}, ${match[2] + match[3]}h3${match[4]}, ${match[2] + match[3]}h4${match[4]}, ${match[2] + match[3]}h5${match[4]}, ${match[2] + match[3]}h6${match[4] + match[1]})`
			: `querySelectorAll(${match[1]}h1${match[2] + match[4]}, h2${match[2] + match[4]}, h3${match[2] + match[4]}, h4${match[2] + match[4]}, h5${match[2] + match[4]}, h6${match[2] + match[4] + match[1]})`;


	

	// :hidden
	
	


	// :first
	regex = /(?: )*(["'`])(.*?)( |>)?:first( |>)?(.*)["'`](?: )*/g;
	match = [...s.matchAll(regex)][0];
	let spaceOrArrowL: boolean = ( match || '')[3] !== undefined;
	let spaceOrArrowR: boolean = ( match || '')[4] !== undefined;

	/*
	if (match) {
		if (spaceOrArrowL && spaceOrArrowR) {
			return `querySelector(${match[1] + match[2] + match[1]}).${makeQuerySelector(match[1] + match[5] + match[1])}`;
		} else if (spaceOrArrowL && !spaceOrArrowR) {
			let sticked: string[] = [...match[5].matchAll(/((?:#|\.)(?:\w|#|\.)+)(?: |>)?(.*)/g)][0];
			return sticked
				? sticked[2]
				? `querySelector(${match[1] + match[2] + sticked[1] + match[1]}).${makeQuerySelector(match[1] + sticked[2] + match[1])}`
				: `querySelector(${match[1] + match[2] + sticked[1] + match[1]})`
				: `querySelector(${match[1] + match[2] + match[1]})`
		} else if (!spaceOrArrowL && spaceOrArrowR) {
			return `querySelector(${match[1] + match[2] + match[1]}).${makeQuerySelector(match[1] + match[5] + match[1])}`
		} else if (!spaceOrArrowL && !spaceOrArrowR) {
			let sticked: string[] = [...match[5].matchAll(/((?:#|\.)(?:\w|#|\.)+)(?: |>)?(.*)/g)][0];
			return sticked
				? sticked[2]
				? `querySelector(${match[1] + match[2] + sticked[1] + match[1]}).${makeQuerySelector(match[1] + sticked[2] + match[1])}`
				: `querySelector(${match[1] + match[2] + sticked[1] + match[1]})`
				: `querySelector(${match[1] + match[2] + match[1]})`
		}
	}
	*/

	//// selector ////
	match = [...s.matchAll(/(?: )*(["'`])(.*)["'`](?: )*/g)][0];
	if (match) return `querySelectorAll(${match[1] + match[2] + match[1]})`;

	return '';
};

export default (text: string) => {
	let t: string = text;

	return `document.${makeQuerySelector(t.replace(/(?:\$|jQuery)\((.*)\)/g, '$1'))}`;
};
