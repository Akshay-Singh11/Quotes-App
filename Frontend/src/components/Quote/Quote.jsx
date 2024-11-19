import React, { Fragment } from 'react';
import styles from "./Quote.module.css"; 
import { useNavigate } from 'react-router-dom';

function Quote(props) {
  let navigate = useNavigate();
  const showQuotehandler = (id)=>{
    navigate(`/quotes/${id}`);
  }
  return (
    <Fragment>
      <li className={styles.quote}>
        <div>
          <p> Quote:{props.text }</p>
          <h3> Author:{ props.author}</h3>
        </div>
        <button onClick= {()=> showQuotehandler(props.id)} > View Full Quotes</button>
    </li>
      
    </Fragment >
  )
}
export default Quote