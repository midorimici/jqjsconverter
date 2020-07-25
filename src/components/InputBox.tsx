import React from 'react';

import Editor from '@monaco-editor/react';

import './Wrapper.scss'

type Props = {
	handleEditorDidMount: (getEditorValue: () => string) => void;
	value: string;
}

export default ({ handleEditorDidMount, value }: Props ) => {
	return (
		<div className='editor'>
			<Editor
				height='30vh'
				language='javascript'
				editorDidMount={handleEditorDidMount}
				value={value}
			/>
		</div>
	);
}
