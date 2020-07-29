import makeQuerySelector from './Selector';
import makeMethod from './Method';

export default (t: string) => {
	let rtn: string = '';

	// selector
	let regex: RegExp = /(?:\$|jQuery)\((.*["'`] *)\)/g;
	if (t.match(regex)) {
		rtn += `document.${makeQuerySelector(t.replace(regex, '$1'))}`;
	}

	t = t.replace(regex, '');

	// method
	regex = /\.(\w+)\((.*)\)/g;
	if (t.match(regex)) {
		rtn = `${makeMethod(t.replace(regex, '$1'), t.replace(regex, '$2'))}`.replace('_', rtn);
	}

	return rtn;
};
