import { useState, useEffect } from 'react';
import InfiniteScroll from 'https://esm.sh/react-infinite-scroll-component';
// https://www.npmjs.com/package/react-infinite-scroll-component
/*
<InfiniteScroll
  dataLength={items.length} //This is important field to render the next data
  next={fetchData}
  hasMore={true}
  loader={<h4>Loading...</h4>}
  endMessage={
    <p style={{ textAlign: 'center' }}>
      <b>Yay! You have seen it all</b>
    </p>
  }
  // below props only if you need pull down functionality
  refreshFunction={this.refresh}
  pullDownToRefresh
  pullDownToRefreshThreshold={50}
  pullDownToRefreshContent={
    <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
  }
  releaseToRefreshContent={
    <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
  }
>
  {items}
</InfiniteScroll>;
*/
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

  const [error, setError] = useState('');

  const fetchData = async () => {
    console.log('fetchData', query);
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
