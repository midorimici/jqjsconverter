import React, { useState, useRef } from 'react';

import InputBox from './InputBox';
import jq2js from '../utils/jqjsconv';

export default () => {
	const [isEditorReady, setIsEditorReady] = useState<boolean>(false);
	const [jqValue, setJQValue] = useState<string>('');
	const [jsValue, setJSValue] = useState<string>('');

	const jqGetter = useRef<() => string>(() => '');
	const jsGetter = useRef<() => string>(() => '');

	const jqHandleEditorDidMount = (valueGetter: () => string): void => {
		setIsEditorReady(true);
		jqGetter.current = valueGetter
	};

	const jsHandleEditorDidMount = (valueGetter: () => string): void => {
		setIsEditorReady(true);
		jsGetter.current = valueGetter
	};

	const convert2JQ = (): void => {
		setJSValue(jq2js(jqGetter.current()));
	};

	/*
	const convert2JS = (): void => {
		setJQValue(jsGetter.current());
	};
	 */

	return (
		<>
			<h2>jQuery</h2>
			<InputBox
				handleEditorDidMount={jqHandleEditorDidMount}
				value={jqValue}
			/>
			<div id='buttons'>
				<button
					id='jqjs-button'
					onClick={convert2JQ}
					disabled={!isEditorReady}
				>▼</button>
			</div>
			<InputBox
				handleEditorDidMount={jsHandleEditorDidMount}
				value={jsValue}
			/>
			<h2>JavaScript</h2>
		</>
	);
};
