import { useRef } from 'react';
import { useKey } from './customHooks/useKey';

export function Search({ query, setQuery }) {
	const inputEL = useRef(null);

	useKey('Enter', function () {
		if (document.activeElement === inputEL.current) return;
		inputEL.current.focus();
		setQuery('');
	});

	return (
		<input
			className='search'
			type='text'
			placeholder='Search movies...'
			value={query}
			onChange={(e) => setQuery(e.target.value)}
			ref={inputEL}
		/>
	);
}
