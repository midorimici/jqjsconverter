import React from 'react';

export default () => {
	return (
		<div style={{textAlign: 'center'}}>
			<p>This app helps you translate jQuery code into native JavaScript code.</p>
			<p>Please be informed that it does not work perfectly and showed results may seem to be erronous,</p>
			<p>though major errors can be caught by the <a href='https://microsoft.github.io/monaco-editor/'>
				Monaco Editor
			</a>.</p>
			<p>Some jQuery selectors and methods are not supported.</p>
			<p>If it does not translate all, try deviding the code into single codes.</p>

			<p>Reference: <a href="https://adventar.org/calendars/1075">脱jQuery Tips Advent Calendar 2015</a> (Japanese)</p>
		</div>
	);
};
