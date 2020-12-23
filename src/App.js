import React, { useState, useEffect, useRef, useReducer } from 'react'
import './App.css'

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState)

  useEffect(() => {
    localStorage.setItem(key, value)
  }, [value, key])

  return [value, setValue]
}

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      }
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      }
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      }
    default:
      throw new Error()
  }
}

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React')
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  })

  useEffect(() => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' })

    fetch(`${API_ENDPOINT}react`)
      .then(response => response.json())
      .then(result => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.hits,
        })
      })
      .catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE' }))
  }, [])

  const handleRemoveStory = item => {
    const newStories = stories.filter(story => item.objectID !== story.objectID)

    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    })
  }

  const handleSearch = e => {
    setSearchTerm(e.target.value)
  }

  const searchedStories = stories.data.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())
  )

  return (
    <div className="App">
      <h1>Hacker Stories</h1>
      <InputWithLabel
        id="search"
        label="Search"
        searchTerm={searchTerm}
        onInputChange={handleSearch}
        value={searchTerm}
        isFocused
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <hr />
      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  )
}

export default App

const InputWithLabel = ({
  id,
  label,
  onInputChange,
  value,
  type = 'text',
  isFocused,
  children,
}) => {
  const inputRef = useRef()

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  return (
    <div>
      <label htmlFor={id}>{children}</label>
      <input
        type={type}
        id={id}
        onChange={onInputChange}
        value={value}
        ref={inputRef}
      />
      <p>{label}</p>
    </div>
  )
}

const List = ({ list, onRemoveItem }) =>
  list.map(item => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  ))

const Item = ({ item, onRemoveItem }) => {
  return (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </div>
  )
}
