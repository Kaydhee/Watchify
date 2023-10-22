import { useEffect, useState } from 'react';
import { MovieDetails } from './MovieDetails';
import { WatchedSummary } from './WatchedSummary';
import { WatchedMovieList } from './WatchedMovieList';
import { MovieList } from './MovieList';
import { Box } from './Box';
import { Main } from './Main';
import { NumResults } from './NumResults';
import { Search } from './Search';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { NavBar } from './NavBar';

export const KEY = '894479a3';

export const average = (arr) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
	const [query, setQuery] = useState('');
	const [movies, setMovies] = useState([]);
	const [watched, setWatched] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [selectedId, setSelectedId] = useState(null);

	function handleSelectMovie(id) {
		setSelectedId((selectedId) => (id === selectedId ? null : id));
	}

	function handleCloseMovie() {
		setSelectedId(null);
	}

	function handleAddWatched(movie) {
		setWatched((watched) => [...watched, movie]);
	}

	function handleDeleteWatched(id) {
		setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
	}

	useEffect(
		function () {
			const controller = new AbortController();
			async function fetchMovies() {
				try {
					setIsLoading(true);
					setError('');

					const res = await fetch(
						`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
						{ signal: controller.signal }
					);

					if (!res.ok)
						throw new Error('Something went wrong while fetching movies');

					const data = await res.json();

					if (data.Response === 'False')
						throw new Error(`You dey mad, wetin be ${query}?`);

					setMovies(data.Search);
					setIsLoading(false);
					setError('');
				} catch (err) {
					if (err.name !== 'AbortError') {
						setError(err.message);
					}
				} finally {
					setIsLoading(false);
				}
			}

			if (query.length < 2) {
				setMovies([]);
				setError('');
				return;
			}

			handleCloseMovie();
			fetchMovies();

			return function () {
				controller.abort();
			};
		},
		[query]
	);

	return (
		<>
			<NavBar>
				<Search
					query={query}
					setQuery={setQuery}
				/>
				<NumResults movies={movies} />
			</NavBar>

			<Main>
				{/* <Box>{isLoading ? <Loader /> : <MovieList movies={movies} />}</Box> */}

				<Box>
					{isLoading && <Loader />}
					{!isLoading && !error && (
						<MovieList
							movies={movies}
							onSelectMovie={handleSelectMovie}
						/>
					)}
					{error && <ErrorMessage message={error} />}
				</Box>

				<Box>
					{selectedId ? (
						<MovieDetails
							selectedId={selectedId}
							onCloseMovie={handleCloseMovie}
							onAddWatched={handleAddWatched}
							watched={watched}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMovieList
								watched={watched}
								onDeleteWatched={handleDeleteWatched}
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	);
}
