import makeQuerySelector from './Selector';
import makeMethod from './Method';


const parBlock = (str: string): string => {
	let flag: number = 0;
	for (let i: number = 0; i < str.length; ++i) {
		if (str[i] === '(') ++flag;
		if (str[i] === ')' && --flag === 0) {
			flag = i;
			break;
		}
	}
	return str.slice(0, flag + 1);
}

export default (t: string) => {
	let rtn: string = '';
	let sel: string = '';
	let regex: RegExp = /./g;

	const parse = (s: string, el?: string): string[] => {
		let ret: string = el || '';
		// selector
		regex = /(?:\$|jQuery)\((.*["'`] *)\)/g;
		if (s.match(regex)) {
			ret += `document.${makeQuerySelector(parBlock(s).replace(regex, '$1'))}`;
			s = s.replace(parBlock(s), '');
		}

		if (s.slice(0, 2) === 'e.') {
			ret = 'e';
			s = s.slice(1);
		}

		let selector: string = ret;

		// method
		regex = /\.(\w+)\(((?:.|\s)*)\)/g;
		if (s.match(regex)) {
			while (parBlock(s)) {
				if (s.match(regex)) {
					ret = makeMethod(parBlock(s).replace(regex, '$1'),
						parBlock(s).replace(regex, '$2')).replace(/%_%/g, ret);
				}
				s = s.replace(parBlock(s), '');
			}
		}

		// single elements, no need to handle as an array
		ret = ret.replace(/(?:Array\.from\()?([\w.("'`\-)]*getElementById\(["'`\w]+\)|.*\[0\]|e)(?:\[0\]|\).(?:map|forEach)\(e => e((?:.|\s)*)\))/g, `$1$2`);

		return [ret, selector];
	}

	[rtn, sel] = parse(t);

	// this
	regex = /(?:\$|jQuery)\( *this *\)/g;
	let ematch: string[] | null = rtn.match(/forEach\(e =>|map\(e =>/g);
	if (rtn.match(regex)) rtn = rtn.replace(regex, ematch ? 'e' : sel);
	regex = /(?:\$|jQuery)\((.*), *this *\)/g;
	if (rtn.match(regex)) rtn = rtn.replace(regex,
		`${rtn.match(/forEach\(e =>|map\(e =>/g) ? 'e' : sel}.${
			makeQuerySelector([...rtn.matchAll(regex)][0][1])}`);
	// console.log(rtn);

	/* inside function
	regex = /(?:function\s*\(\s*[^)]*\s*\)|\(\s*[^)]*\s*\)\s*=>)\s*{?\s*(.*)\s*}?/g;
	let match: string[] = [...rtn.matchAll(regex)][0];
	if (match) rtn = rtn.replace(match[1], ematch ? parse(match[1])[0] : parse(match[1].slice(sel.length), sel)[0]);
	*/

	rtn = (rtn || t).replace(/event\.page([XY])/g, 'MouseEvent.page$1');

	return rtn;
};
