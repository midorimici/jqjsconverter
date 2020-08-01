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

	// selector
	let regex: RegExp = /(?:\$|jQuery)\((.*["'`] *)\)/g;
	if (t.match(regex)) {
		rtn += `document.${makeQuerySelector(parBlock(t).replace(regex, '$1'))}`;
		t = t.replace(parBlock(t), '');
	}

	// method
	regex = /\.(\w+)\((.*)\)/g;
	if (t.match(regex)) {
		while (parBlock(t)) {
			if (t.match(regex)) {
				rtn = `${makeMethod(parBlock(t).replace(regex, '$1'),
					parBlock(t).replace(regex, '$2'))}`.replace(/%_%/g, rtn);
			}
			t = t.replace(parBlock(t), '');
		}
	}

	rtn = rtn.replace(/(?:Array\.from\()?(.*getElementById\(["'`\w]+\)|.*\[0\])(?:\[0\]|\).(?:map|forEach)\(e => e(.*)\))/g, `$1$2`);

	rtn = (rtn || t).replace(/event\.page([XY])/g, 'MouseEvent.page$1');

	return rtn;
};
