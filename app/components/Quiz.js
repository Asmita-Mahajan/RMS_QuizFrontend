
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Quiz.css";

const Quiz = () => {
  const [questions, setQuestions] = useState([]); // Store all quiz questions
  const [currentQuestion, setCurrentQuestion] = useState(0); // Track the current question
  const [showPopup, setShowPopup] = useState(false); // Controls visibility of the popup modal
  const [popupMessage, setPopupMessage] = useState(""); // Popup message (success or error)
  const [candidateName, setCandidateName] = useState(""); // Candidate's name
  const [testKey, setTestKey] = useState(""); // Candidate's test key
  const [isTestStarted, setIsTestStarted] = useState(false); // Flag to check if the test has started
  const [error, setError] = useState(""); // Error message for validation
  const [isTestCompleted, setIsTestCompleted] = useState(false); // Flag to check if the test is completed
  const [timeLeft, setTimeLeft] = useState(1300); // 30 minutes in seconds

  // Fetch quiz questions
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/quiz/all") // Replace with your Spring Boot API endpoint
      .then((response) => {
        setQuestions(response.data); // Set the questions from the backend
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, []);

  // Timer logic
  useEffect(() => {
    if (isTestStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [isTestStarted, timeLeft]);

  // Derived values
  const markedQuestions =
    isTestStarted && questions.length > 0
      ? questions.filter((q) => q.status === "review")
      : [];

  const answeredQuestions =
    isTestStarted && questions.length > 0
      ? questions.filter((q) => q.selectedOption !== null)
      : [];

  const handleOptionSelect = (optionKey) => {
    const updatedQuestions = questions.map((q, index) =>
      index === currentQuestion
        ? { ...q, selectedOption: optionKey, status: "attended" }
        : q
    );
    setQuestions(updatedQuestions);
  };

  const handleClearSelection = () => {
    const updatedQuestions = questions.map((q, index) =>
      index === currentQuestion
        ? { ...q, selectedOption: null, status: "not-checked" }
        : q
    );
    setQuestions(updatedQuestions);
  };

  const handleMarkForReview = () => {
    const updatedQuestions = questions.map((q, index) =>
      index === currentQuestion ? { ...q, status: "review" } : q
    );
    setQuestions(updatedQuestions);
  };

  const startQuiz = () => {
    if (!candidateName.trim() || !testKey.trim()) {
      setError("Please enter both your name and test key.");
      return;
    }
    setError(""); // Clear error message
    setIsTestStarted(true); // Begin the quiz
  };

  const handleSubmit = () => {
    const selectedAnswers = questions.map((q) => ({
      questionId: q.id,
      questionNo: q.questionNo,
      selectedOption: q.selectedOption,
      questionType: q.questionType,
    }));

    const submissionData = {
      candidateName,
      testKey,
      answers: selectedAnswers,
    };

    axios
      .post("http://localhost:8080/api/quiz/submit", submissionData)
      .then(() => {
        setPopupMessage("Quiz Submitted Successfully!");
        setShowPopup(true);
      })
      .catch(() => {
        setPopupMessage("Error submitting quiz.");
        setShowPopup(true);
      });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleNavigation = (index) => {
    setCurrentQuestion(index);
  };

  return (
    <div className="quiz-container">
      {!isTestStarted ? (
        <div className="start-test">
          <h2>Enter your Name and Test Key</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={candidateName}
            onChange={(e) => {
              const regex = /^[a-zA-Z\s]*$/; // Allow only letters and spaces
              if (regex.test(e.target.value)) {
                setCandidateName(e.target.value); // Update name only if input is valid
              }
            }}
          />
          <input
            type="number"
            placeholder="Enter test key"
            value={testKey}
            onChange={(e) => setTestKey(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <button onClick={startQuiz} className="start-button">
            Start Test
          </button>
        </div>
      ) : isTestCompleted ? (
        <div className="thank-you-message">
          <h2>Thank you for participating in the test!</h2>
        </div>
      ) : (
        <>
          <div className="question-section">
            {questions.length > 0 && (
              <div className="question-text">
                <h4>Question {currentQuestion + 1}</h4>
                <p>{questions[currentQuestion]?.question}</p>
                <div className="options">
                  {["optionA", "optionB", "optionC", "optionD"].map((key) => (
                    <div
                      key={key}
                      className={`option ${
                        questions[currentQuestion]?.selectedOption === key
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => handleOptionSelect(key)}
                    >
                      {questions[currentQuestion]?.[key]}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="navigation-buttons">
              <button
                className="btn btn-success"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
              >
                Previous
              </button>
              <button className="btn btn-warning" onClick={handleMarkForReview}>
                Mark for Review & Next
              </button>
              <button
                className="btn btn-success"
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                disabled={currentQuestion === questions.length - 1}
              >
                Next
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleClearSelection}
              >
                Clear Answer
              </button>
              <button
                className="btn btn-danger"
                disabled={answeredQuestions.length === 0}
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
          <div className="side-panel">
            <div className="timer">
              <h4>Time Status</h4>
              <div className={`time-left ${timeLeft <= 10 ? "blink-red" : ""}`}>
                {formatTime(timeLeft)}
              </div>
              <div>Total Time: 00:30:00</div>
            </div>
            <div className="question-navigation">
              <h5>Question Navigation</h5>
              <div className="question-list">
                {questions.map((question, index) => (
                  <button
                    key={index}
                    className={`question-button ${
                      currentQuestion === index ? "active" : ""
                    } ${
                      question.status === "review" ? "marked-for-review" : ""
                    }`}
                    onClick={() => handleNavigation(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="summary">
              <h5>Summary</h5>
              <div>
                Answered: {isTestStarted ? answeredQuestions.length : 0}
              </div>
              <div>Marked: {isTestStarted ? markedQuestions.length : 0}</div>
            </div>
          </div>
          {showPopup && (
            <>
              <div className="overlay"></div> {/* Overlay background */}
              <div className="popup">
                <div className="popup-content">
                  <h2>{popupMessage}</h2>
                  <button
                    onClick={() => {
                      setShowPopup(false);
                      setIsTestCompleted(true);
                    }}
                    className="btn btn-primary"
                  >
                    OK
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Quiz;

