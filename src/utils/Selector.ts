export default (s: string): string => {
	//// query selection ////
	// tag
	// div, p, button, etc...
	let match: string[] = [...s.matchAll(/(?: )*(["'`])(\w*)["'`](?: )*/g)][0];
	if (match) return `getElementsByTagName(${match[1] + match[2] + match[1]})`;
	// id
	// #id
	match = [...s.matchAll(/(?: )*(["'`])[.\w]*#(\w*)[.\w]*["'`](?: )*/g)][0];
	if (match) return `getElementById(${match[1] + match[2] + match[1]})`;
	// class
	// .foo
	match = [...s.matchAll(/(?: )*(["'`])\.(\w*)["'`](?: )*/g)][0];
	if (match) return `getElementsByClassName(${match[1] + match[2] + match[1]})`;
	// name
	match = [...s.matchAll(/(?: )*(["'`]) *\[ *name *= *(\w*) *\] *["'`](?: )*/g)][0];
	if (match) return `getElementsByName(${match[1] + match[2] + match[1]})`;

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
	regex = /(?: )*(["'`])(.*):submit(.*)["'`](?: )*/g;
	match = [...s.matchAll(regex)][0];
	if (match) {
		let sticked: string[] = [...match[2].matchAll(/(?:(.*(?: |>))((?:#|.)w+)?|(?:#|.)w+)/g)][0];
		if (sticked) {
			if (sticked[2]) {
				return `querySelectorAll(${match[1] + sticked[1]}input[type=${quotSign}submit${quotSign}]${sticked[2] + match[3]}, ${sticked[1]}button[type=${quotSign}submit${quotSign}]${sticked[2] + match[3] + match[1]})`
			} else {
				if (sticked[1]) {
					return `querySelectorAll(${match[1] + sticked[1]}input[type=${quotSign}submit${quotSign}]${match[3]}, ${sticked[1]}button[type=${quotSign}submit${quotSign}]${match[3] + match[1]})`
				} else {
					return `querySelectorAll(${match[1]}input[type=${quotSign}submit${quotSign}]${sticked[0] + match[3]}, button[type=${quotSign}submit${quotSign}]${sticked[0] + match[3] + match[1]})`
				}
			}
		} else {
			return `querySelectorAll(${match[1]}input[type=${quotSign}submit${quotSign}]${match[3]}, button[type=${quotSign}submit${quotSign}]${match[3] + match[1]})`
		}
	}

	// :text
	regex = /(?: )*(["'`])(.*):text(.*)["'`](?: )*/g;
	match = [...s.matchAll(regex)][0];
	if (match) {
		let sticked: string[] = [...match[2].matchAll(/(?:(.*(?: |>))((?:#|.)w+)?|(?:#|.)w+)/g)][0];
		if (sticked) {
			if (sticked[2]) {
				return `querySelectorAll(${match[1] + sticked[1]}input[type=${quotSign}text${quotSign}]${sticked[2] + match[3]}, ${sticked[1]}input:not([type])${sticked[2] + match[3] + match[1]})`
			} else {
				if (sticked[1]) {
					return `querySelectorAll(${match[1] + sticked[1]}input[type=${quotSign}text${quotSign}]${match[3]}, ${sticked[1]}input:not([type])${match[3] + match[1]})`
				} else {
					return `querySelectorAll(${match[1]}input[type=${quotSign}text${quotSign}]${sticked[0] + match[3]}, input:not([type])${sticked[0] + match[3] + match[1]})`
				}
			}
		} else {
			return `querySelectorAll(${match[1]}input[type=${quotSign}text${quotSign}]${match[3]}, input:not([type])${match[3] + match[1]})`
		}
	}

	// :input
	regex = /(?: )*(["'`])(.*):input(.*)["'`](?: )*/g;
	match = [...s.matchAll(regex)][0];
	if (match) {
		let sticked: string[] = [...match[2].matchAll(/(?:(.*(?: |>))((?:#|.)w+)?|(?:#|.)w+)/g)][0];
		if (sticked) {
			if (sticked[2]) {
				return `querySelectorAll(${match[1] + sticked[1]}input${sticked[2] + match[3]}, ${sticked[1]}select${sticked[2] + match[3]}, ${sticked[1]}textarea${sticked[2] + match[3]}, ${sticked[1]}button${sticked[2] + match[3] + match[1]})`
			} else {
				if (sticked[1]) {
					return `querySelectorAll(${match[1] + sticked[1]}input${match[3]}, ${sticked[1]}select${match[3]}, ${sticked[1]}textarea${match[3]}, ${sticked[1]}button${match[3] + match[1]})`
				} else {
					return `querySelectorAll(${match[1]}input${sticked[0] + match[3]}, select${sticked[0] + match[3]}, textarea${sticked[0] + match[3]}, button${sticked[0] + match[3] + match[1]})`
				}
			}
		} else {
			return `querySelectorAll(${match[1]}input${match[3]}, select${match[3]}, textarea${match[3]}, button${match[3] + match[1]})`
		}
	}

	// :header
	regex = /(?: )*(["'`])(.*):header(.*)["'`](?: )*/g;
	match = [...s.matchAll(regex)][0];
	if (match) {
		let sticked: string[] = [...match[2].matchAll(/(?:(.*(?: |>))((?:#|.)w+)?|(?:#|.)w+)/g)][0];
		if (sticked) {
			if (sticked[2]) {
				return `querySelectorAll(${match[1] + sticked[1]}h1${sticked[2] + match[3]}, ${sticked[1]}h2${sticked[2] + match[3]}, ${sticked[1]}h3${sticked[2] + match[3]}, ${sticked[1]}h4${sticked[2] + match[3]}, ${sticked[1]}h5${sticked[2] + match[3]}, ${sticked[1]}h6${sticked[2] + match[3] + match[1]})`
			} else {
				if (sticked[1]) {
					return `querySelectorAll(${match[1] + sticked[1]}h1${match[3]}, ${sticked[1]}h2${match[3]}, ${sticked[1]}h3${match[3]}, ${sticked[1]}h4${match[3]}, ${sticked[1]}h5${match[3]}, ${sticked[1]}h6${match[3] + match[1]})`
				} else {
					return `querySelectorAll(${match[1]}h1${sticked[0] + match[3]}, h2${sticked[0] + match[3]}, h3${sticked[0] + match[3]}, h4${sticked[0] + match[3]}, h5${sticked[0] + match[3]}, h6${sticked[0] + match[3] + match[1]})`
				}
			}
		} else {
			return `querySelectorAll(${match[1]}h1${match[3]}, h2${match[3]}, h3${match[3]}, h4${match[3]}, h5${match[3]}, h6${match[3] + match[1]})`
		}
	}

	

	// :hidden
	// :visible
	
	

	//// create element ////
	// <div>
	match = [...s.matchAll(/(?: )*(["'`])<(\w+)\s*\/?>(?:<\/\w+>)?["'`](?: )*/g)][0];
	if (match) return `createElement(${match[1] + match[2] + match[1]})`;

	// <div prop="">
	match = [...s.matchAll(/(?: )*(["'`])<((?:[^>]|\n)+?)>(?:<\/\w+>)?["'`](?: )*/g)][0];
	if (match) return `createElement(${match[1] + match[2].replace(/(\w+)\s/, '$1') + match[1]})\n`
		+ ``;

	//// selector ////
	match = [...s.matchAll(/(?: )*(["'`])(.*)["'`](?: )*/g)][0];
	if (match) return `querySelectorAll(${match[1] + match[2] + match[1]})`;

	return '';
};

