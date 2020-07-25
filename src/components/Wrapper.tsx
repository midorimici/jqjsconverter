import React, { useState, useRef } from 'react';

import InputBox from './InputBox';

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

	const getJQValue = (): void => {
		setJSValue(jqGetter.current());
	};

	const getJSValue = (): void => {
		setJQValue(jsGetter.current());
	};

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
					onClick={getJQValue}
					disabled={!isEditorReady}
				>▼</button>
				<button
					id='jsjq-button'
					onClick={getJSValue}
					disabled={!isEditorReady}
				>▲</button>
			</div>
			<InputBox
				handleEditorDidMount={jsHandleEditorDidMount}
				value={jsValue}
			/>
			<h2>JavaScript</h2>
		</>
	);
};
