import makeQuerySelector from './Selector';
import makeMethod from './Method';

export default (t: string) => {
	let rtn: string = '';

	// selector
	// with following method
	let flag: number = 0;
	for (let i = 0; i < t.length; ++i) {
		if (t[i] === '(') ++flag;
		if (t[i] === ')') {
			--flag;
			if (flag === 0) flag = i; break;
		}
	}

	rtn += `document.${makeQuerySelector(t.slice(0, flag + 1).replace(/(?:\$|jQuery)\((.*["'`] *)\)/g, '$1'))}`;

	t = t.replace(t.slice(0, flag + 1), '');

	// method
	let regex: RegExp = /\.(\w+)\((.*)\)/g;
	if (t.match(regex)) {
		rtn = `${makeMethod(t.replace(regex, '$1'), t.replace(regex, '$2'))}`.replace(/%_%/g, rtn);
	}

	return rtn;
};
