import React from 'react';

import Editor from '@monaco-editor/react';

import './InputBox.scss'

export default ({ handleEditorDidMount }: { handleEditorDidMount: (getEditorValue: () => string) => void }) => {
	return (
		<div className='editor'>
			<Editor
				height='30vh'
				language='javascript'
				editorDidMount={handleEditorDidMount}
			/>
		</div>
	);
}
