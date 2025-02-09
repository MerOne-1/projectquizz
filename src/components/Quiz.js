import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const { theme } = useParams();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`https://raw.githubusercontent.com/MerOne-1/projectquizz/main/quiz-data/themes/${theme}.json`);
        setQuestions(response.data.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, [theme]);

  const handleAnswerSelect = (answer) => {
    const newSelectedAnswers = selectedAnswers.includes(answer)
      ? selectedAnswers.filter(a => a !== answer)
      : [...selectedAnswers, answer];
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleSubmit = () => {
    const currentQ = questions[currentQuestion];
    const isCorrect = currentQ.correct_answers.length === selectedAnswers.length &&
      currentQ.correct_answers.every(answer => selectedAnswers.includes(answer));
    
    if (isCorrect) setScore(score + 1);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswers([]);
    } else {
      setShowResults(true);
    }
  };

  if (!questions.length) return <div>Loading...</div>;
  if (showResults) {
    return (
      <div className="quiz-container">
        <h2>Quiz Results</h2>
        <p>Your score: {score} out of {questions.length}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <h2>{question.question}</h2>
      <div className="options-container">
        {question.options.map((option, index) => (
          <label key={index} className="option-label">
            <input
              type="checkbox"
              checked={selectedAnswers.includes(option)}
              onChange={() => handleAnswerSelect(option)}
            />
            {option}
          </label>
        ))}
      </div>
      <button onClick={handleSubmit} className="submit-btn">
        {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </button>
      <div className="progress">
        Question {currentQuestion + 1} of {questions.length}
      </div>
    </div>
  );
};

export default Quiz;
