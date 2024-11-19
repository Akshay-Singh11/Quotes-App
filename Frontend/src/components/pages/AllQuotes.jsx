import React, { Fragment, useEffect, useState } from 'react'
import Quote from '../Quote/Quote'

function AllQuotes() {
  // api call =>  side effect
  let [quotes, setQuotes] = useState([])

  async function getQuotes() {
    try {
      let resp = await fetch('http://localhost:8080/allQuotes');
      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
      let data = await resp.json();
      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error.message);
    }
  }
  useEffect(() => {
    getQuotes()
  }, [])


  return (
    <Fragment>
      <div>AllQuotes</div>
      {
        quotes.map((quote, index) => {
          return (<Quote key={quote._id} author={quote.author} text={quote.text} id={quote._id} />)
        })
      }
    </Fragment>
  )
}

export default AllQuotes

