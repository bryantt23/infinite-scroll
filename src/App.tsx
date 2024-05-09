import { useState, useEffect } from 'react';
import InfiniteScroll from 'https://esm.sh/react-infinite-scroll-component';
// https://www.npmjs.com/package/react-infinite-scroll-component

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    console.log('fetchData', query);
    setLoading(true);
    setError('');
    try {
      if (query.length < 3) {
        return;
      }
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=71949abe&s=${query}&page=1`
      );
      const data = await response.json();
      console.log(query, data);
      if (!data.Search) {
        setMovies([]);
      } else if (data.Response === 'True') {
        setMovies([...movies, ...data.Search]);
      } else {
        setError(data.Error);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query]);

  console.log(movies);

  return (
    <div>
      <input
        type='text'
        placeholder='Search Movies'
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {movies.map(movie => (
          <div key={movie.imdbID} style={{ width: '200px' }}>
            <img
              src={movie.Poster}
              alt={movie.Title}
              style={{ width: '100%' }}
            />
            <h4>{movie.Title}</h4>
            <p>{movie.Year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
