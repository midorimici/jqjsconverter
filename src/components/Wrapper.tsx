import React, { useState, useRef } from 'react';

import InputBox from './InputBox';

export default () => {
	const [isEditorReady, setIsEditorReady] = useState<boolean>(false);

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

	const getJQValue = (): void => console.log(jqGetter.current());
	const getJSValue = (): void => console.log(jsGetter.current());

	return (
		<>
			<h2>jQuery</h2>
			<InputBox handleEditorDidMount={jqHandleEditorDidMount} />
			<div id='buttons'>
				<button
					id='jqjs-button'
					onClick={getJQValue}
				>▼</button>
				<button
					id='jsjq-button'
					onClick={getJSValue}
				>▲</button>
			</div>
			<InputBox handleEditorDidMount={jsHandleEditorDidMount} />
			<h2>JavaScript</h2>
		</>
	);
};
