import React, { useState } from 'react'
import './App.css'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('React')

  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org',
      author: 'John Doe',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://google.com',
      author: 'Bob Smith',
      num_comments: 5,
      points: 7,
      objectID: 1,
    },
  ]

  const handleSearch = e => {
    setSearchTerm(e.target.value)
  }

  const searchedStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())
  )

  return (
    <div className="App">
      <h1>Hacker Stories</h1>
      <Search searchTerm={searchTerm} onSearch={handleSearch} />
      <hr />
      <List list={searchedStories} />
    </div>
  )
}

export default App

const Search = ({ onSearch, searchTerm }) => {
  return (
    <div>
      <label htmlFor="search">
        <input type="text" id="search" onChange={onSearch} value={searchTerm} />
      </label>
      <p>{searchTerm}</p>
    </div>
  )
}

const List = ({ list }) => {
  list.map(item => <Item key={item.objectID} item={item} />)

  const Item = ({ item }) => (
    <div key={item.objectID}>
      <h3>{item.title}</h3>
      <a href={item.url}>Link</a>
      <p>{item.author}</p>
      <div>
        <span>Comments: {item.num_comments}</span>
        <span>Points: {item.points}</span>
        <span>objectID: {item.objectID}</span>
      </div>
    </div>
  )
}
