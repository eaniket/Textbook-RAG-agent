import React, { useState } from 'react';

const AskQuestion = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });
            const data = await response.json();
            setAnswer(data.answer);
        } catch (error) {
            console.error('Error:', error);
            setAnswer('Sorry, there was an error. Please try again.');
        }
        setIsLoading(false);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode');
    };

    return (
        <div className="ask-question-container">
            <div className="header">
                <h1>Ask Your Question</h1>
                <button onClick={toggleDarkMode} className="mode-toggle">
                    {darkMode ? '☀️' : '🌙'}
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type your question here..."
                    required
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Thinking...' : 'Ask'}
                </button>
            </form>
            {answer && (
                <div className="answer">
                    <h2>Answer:</h2>
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

export default AskQuestion;