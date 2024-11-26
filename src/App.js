import React, { useState } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/ask', {
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

  return (
    <div className="App">
      <header>
        <h1>NCERT AI Assistant</h1>
      </header>
      <main>
        <div className="content-wrapper">
          <h2>Ask Your Question</h2>
          <p>Get answers to your NCERT questions instantly!</p>
          <form onSubmit={handleSubmit}>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              required
            />
            <button type="submit" disabled={isLoading} className={isLoading ? 'thinking' : ''}>
              {isLoading ? (
                <>
                  <span className="thinking-text">Thinking</span>
                  <span className="thinking-dots"><span>.</span><span>.</span><span>.</span></span>
                </>
              ) : (
                'Ask'
              )}
            </button>
          </form>
          {answer && (
            <div className="answer">
              <h3>Answer:</h3>
              <p>{answer}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;