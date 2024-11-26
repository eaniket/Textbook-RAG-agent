import React from 'react';
import ReactDOM from 'react-dom';
import AskQuestion from './components/AskQuestion';
import './styles.css';

const App = () => {
    return (
        <div className="app-container">
            <AskQuestion />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));