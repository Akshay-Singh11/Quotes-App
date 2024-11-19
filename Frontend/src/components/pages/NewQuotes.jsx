import React, { Fragment, useRef } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from './NewQuote.module.css';


function NewQuote() {

    const usernameInpRef = useRef();
    const quoteInpRef = useRef();
    let navigate = useNavigate()

    const addQuoteHandler = async (e) => {
        e.preventDefault();
        let author = usernameInpRef.current.value.trim();
        let text = quoteInpRef.current.value.trim();

        if (!author || !text) {
            alert("Please fill out both fields!");
            return;
        }

        try {
            let resp = await axios.post('http://localhost:8080/addQuotes', { author, text });
            navigate('/');
        } catch (error) {
            console.error("Failed to post the quote:", error);
        }
    };



    return (
        <Fragment>
            <form onSubmit={addQuoteHandler} className={styles.form}>
                <h1 className={styles.heading}>New Quote Form</h1>
                <div className={styles.field}>
                    <label htmlFor="author" className={styles.label}>Author:</label>
                    <input
                        type="text"
                        id="author"
                        ref={usernameInpRef}
                        placeholder="Add author name"
                        className={styles.input}
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="quote" className={styles.label}>Quote:</label>
                    <textarea
                        rows={4}
                        cols={10}
                        id="quote"
                        ref={quoteInpRef}
                        placeholder="Add author quote"
                        className={styles.textarea}
                    ></textarea>
                </div>
                <button className={styles.button}>Add Quote</button>
            </form>
        </Fragment>

    )
}

export default NewQuote