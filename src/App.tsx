import React from 'react';

import Wrapper from './components/Wrapper';
import Description from './components/Description';

import './App.scss';

export default () => {
  return (
		<>
			<div id='App'>
				<header id='App-header'>
					jQuery - JavaScript Converter
				</header>
				<main id='main'>
					<Wrapper />
				</main>
			</div>
			<Description />
		</>
  );
}
