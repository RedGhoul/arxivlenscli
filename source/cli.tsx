#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

meow(
	`
	Usage
	  $ arxivlenscli

	Navigation
	  Arrow keys  Navigate menus and lists
	  Enter       Select/confirm
	  Tab         Next field (in forms)
	  Esc         Go back
	  q           Quit (from main menu)
	  Q           Force quit (from anywhere)

	Paper Actions
	  a           Open paper on arXiv
	  p           Open PDF
	  m           Toggle full abstract

	Pagination
	  n / →       Next page
	  p / ←       Previous page
`,
	{
		importMeta: import.meta,
		flags: {},
	},
);

render(<App />);
