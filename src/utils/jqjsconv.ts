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
	let regex: RegExp = /./g;

	const parse = (s: string): string => {
		let ret: string = '';
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

		return ret;
	}

	rtn = parse(t);

	// this
	regex = /(?:\$|jQuery)\( *this *\)/g;
	if (rtn.match(regex)) rtn = rtn.replace(regex, 'e');
	regex = /(?:\$|jQuery)\((.*), *this *\)/g;
	if (rtn.match(regex)) rtn = rtn.replace(regex, `e.${makeQuerySelector([...rtn.matchAll(regex)][0][1])}`);

	// inside function
	regex = /(?:function\s*\(\s*[^)]*\s*\)|\(\s*[^)]*\s*\)\s*=>)\s*{?\s*(.*)\s*}?/g;
	let match: string[] = [...rtn.matchAll(regex)][0];
	if (match) rtn = rtn.replace(match[1], parse(match[1]));

	rtn = rtn.replace(/(?:Array\.from\()?([\w.("'`\-)]*getElementById\(["'`\w]+\)|.*\[0\]|e)(?:\[0\]|\).(?:map|forEach)\(e => e(.*)\))/g, `$1$2`);

	rtn = (rtn || t).replace(/event\.page([XY])/g, 'MouseEvent.page$1');

	return rtn;
};
