export default (text: string) => {
	let t: string = text;

	//// query selection ////
	// tag
	// div
	t = t.replace(/(?:\$|jQuery)\((?: )*(["'`])(\w*)["'`](?: )*\)/g,
		`document.getElementsByTagName($1$2$1)`)
	// id
	// #id
	t = t.replace(/(?:\$|jQuery)\((?: )*(["'`])#(\w*)["'`](?: )*\)/g,
		`document.getElementById($1$2$1)`)
	// class
	// .foo
	t = t.replace(/(?:\$|jQuery)\((?: )*(["'`])\.(\w*)["'`](?: )*\)/g,
		`document.getElementsByClassName($1$2$1)`)

	//// jQuery extensions ////
	let quotSign: string = [...t.matchAll(/(?:\$|jQuery)\((?: )*(["'`]).*["'`](?: )*\)/g)][0][1] === `"` ? `'` : `"`;

	// [property!=value]
	t = t.replace(/(?:\$|jQuery)\((?: )*(["'`])(.*)\[(\w+)!=(\w+)\](.*)["'`](?: )*\)/g,
		`document.querySelectorAll($1$2:not([$3=$4])$5$1)`)

	// :file, :image, :password, :radio, :reset
	t = t.replace(/(?:\$|jQuery)\((?: )*(["'`])(.*)(?::(file|image|password|radio|reset))(.*)["'`](?: )*\)/g,
		`document.querySelectorAll($1$2[type=${quotSign}$3${quotSign}]$4$1)`)

	// :parent
	t = t.replace(/(?:\$|jQuery)\((?: )*(["'`])(.*):parent(.*)["'`](?: )*\)/g,
		`document.querySelectorAll($1$2:not(:empty)$3$1)`)

	// :selected
	t = t.replace(/(?:\$|jQuery)\((?: )*(["'`])(.*):selected(.*)["'`](?: )*\)/g,
		`document.querySelectorAll($1$2:checked$3$1)`)

	// :button
	let regex: RegExp = /(?:\$|jQuery)\((?: )*(["'`])(.*?)( |>)?:button(.*)["'`](?: )*\)/g;
	let spaceOrArrow: boolean = ([...t.matchAll(regex)][0] || '')[3] !== undefined;
	t = t.replace(regex,
		spaceOrArrow
			? `document.querySelectorAll($1$2$3button$4, $2$3input[type=${quotSign}button${quotSign}]$4$1)`
			: `document.querySelectorAll($1button$2$4, input[type=${quotSign}button${quotSign}]$2$4$1)`)

	// :submit
	regex = /(?:\$|jQuery)\((?: )*(["'`])(.*?)( |>)?:submit(.*)["'`](?: )*\)/g;
	spaceOrArrow = ([...t.matchAll(regex)][0] || '')[3] !== undefined;
	t = t.replace(regex,
		spaceOrArrow
			? `document.querySelectorAll($1$2$3input[type=${quotSign}submit${quotSign}]$4, $2$3button[type=${quotSign}submit${quotSign}]$4$1)`
			: `document.querySelectorAll($1input[type=${quotSign}submit${quotSign}]$2$4, button[type=${quotSign}submit${quotSign}]$2$4$1)`)

	// :text
	regex = /(?:\$|jQuery)\((?: )*(["'`])(.*?)( |>)?:text(.*)["'`](?: )*\)/g;
	spaceOrArrow = ([...t.matchAll(regex)][0] || '')[3] !== undefined;
	t = t.replace(regex,
		spaceOrArrow
			? `document.querySelectorAll($1$2$3input[type=${quotSign}text${quotSign}]$4, $2$3input:not([type])$4$1)`
			: `document.querySelectorAll($1input[type=${quotSign}text${quotSign}]$2$4, input:not([type])$2$4$1)`)

	// :input
	regex = /(?:\$|jQuery)\((?: )*(["'`])(.*?)( |>)?:input(.*)["'`](?: )*\)/g;
	spaceOrArrow = ([...t.matchAll(regex)][0] || '')[3] !== undefined;
	t = t.replace(regex,
		spaceOrArrow
			? `document.querySelectorAll($1$2$3input$4, $2$3select$4, $2$3textarea$4, $2$3button$4$1)`
			: `document.querySelectorAll($1input$2$4, select$2$4, textarea$2$4, button$2$4$1)`)

	// :header
	regex = /(?:\$|jQuery)\((?: )*(["'`])(.*?)( |>)?:header(.*)["'`](?: )*\)/g;
	spaceOrArrow = ([...t.matchAll(regex)][0] || '')[3] !== undefined;
	t = t.replace(regex,
		spaceOrArrow
			? `document.querySelectorAll($1$2$3h1$4, $2$3h2$4, $2$3h3$4, $2$3h4$4, $2$3h5$4, $2$3h6$4$1)`
			: `document.querySelectorAll($1h1$2$4, h2$2$4, h3$2$4, h4$2$4, h5$2$4, h6$2$4$1)`)

	//// selector ////
	t = t.replace(/(?:\$|jQuery)\((?: )*(["'`])(.*)["'`](?: )*\)/g,
		`document.querySelectorAll($1$2$1)`);

	return t;
};
