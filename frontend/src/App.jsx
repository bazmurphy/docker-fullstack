import { useEffect, useState } from 'react'
import AddMessageForm from './AddMessageForm';

const App = () => {
  const [data, setData] = useState([]);
  const [dataChanged, setDataChanged] = useState(false);

  const fetchData = async () => {
    // console.log("fetchData ran")
    const response = await fetch("http://localhost:4000/")
    // console.log("fetchData response:", response);
    const json = await response.json()
    // console.log("fetchData json:", json);
    const data = json.data;
    // console.log("fetchData data:", data);
    setData(data);
  };

  useEffect(() => {
    // console.log("useEffect ran");
    fetchData();
  }, [dataChanged])

  return (
    <div className="App">
      <h1>Chat:</h1>
      <ul>
        {data && data.map((entry) => {
          return (
            <li key={entry.id}>
              <span className="entry-id">{entry.id}</span>
              <span className="entry-author">{entry.author}</span>
              <span className="entry-separator">:</span>
              <span className="entry-message">{entry.message}</span>
            </li>
          )
        })}
      </ul>
      <AddMessageForm setDataChanged={setDataChanged} />
    </div >
  )
}

export default App
