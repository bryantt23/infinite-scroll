import { useState, useEffect } from 'react'

import InfiniteScroll from "https://esm.sh/react-infinite-scroll-component";
// https://www.npmjs.com/package/react-infinite-scroll-component

const states = {
  loading: "Loading",
  success: "Success",
  noMore: "NoMore",
  error: "Error"
};

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [state, setState] = useState(states.loading)
  const [pageNumber, setPageNumber] = useState(1)
  const [error, setError] = useState('');

  const fetchData = async () => {
    console.log("fetchData", query)
    setState(states.loading)
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=71949abe&s=${query}&page=${pageNumber}`);
      const data = await response.json();
      if (data.Response === "True") {
        const newMovies = pageNumber === 1 ? data.Search : [...movies, ...data.Search]
        setMovies(newMovies)
        if (data.Search.length > 0) {
          setPageNumber(prevPageNumber => prevPageNumber + 1)
          setState(states.success)
        }
        else {
          setState(states.noMore)
        }
      } else {
        setState(states.error)
        setError(data.Error);
      }
    } catch (error) {
      console.error(error)
      setError('Failed to fetch data');
    }
  };

  useEffect(() => {
    if (query.length >= 3) {
      setPageNumber(1)
      setMovies([])
      fetchData();
    }
  }, [query]);//change query so reset everything

  console.log(movies)

  return (
    <div>
      <input
        type="text"
        placeholder="Search Movies"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {state.loading && <div>Loading...</div>}
      {state.error && <div>{error}</div>}

      <InfiniteScroll
        dataLength={movies.length} //This is important field to render the next data
        next={fetchData}
        hasMore={state === states.success}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >

        {movies.map((movie) => (
          <div key={movie.imdbID} style={{ width: '200px' }}>
            <img src={movie.Poster} alt={movie.Title} style={{ width: '100%' }} />
            <h4>{movie.Title}</h4>
            <p>{movie.Year}</p>
          </div>
        ))}
      </InfiniteScroll>


    </div>
  );
};



export default App
