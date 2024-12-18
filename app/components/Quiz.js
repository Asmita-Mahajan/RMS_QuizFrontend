
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

  // Fetch questions from the Spring Boot backend
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

  // Handle selecting an option
  const handleOptionSelect = (optionKey) => {
    const updatedQuestions = questions.map((q, index) =>
      index === currentQuestion
        ? { ...q, selectedOption: optionKey, status: "attended" }
        : q
    );
    setQuestions(updatedQuestions);
  };

  // Clear the selected option for the current question
  const handleClearSelection = () => {
    const updatedQuestions = questions.map((q, index) =>
      index === currentQuestion
        ? { ...q, selectedOption: null, status: "not-checked" }
        : q
    );
    setQuestions(updatedQuestions);
  };

  // Handle marking a question for review
  const handleMarkForReview = () => {
    const updatedQuestions = questions.map((q, index) =>
      index === currentQuestion ? { ...q, status: "review" } : q
    );
    setQuestions(updatedQuestions);
  };

  // Start the quiz
  const startQuiz = () => {
    if (!candidateName.trim() || !testKey.trim()) {
      setError("Please enter both your name and test key.");
      return;
    }
    setError(""); // Clear error message
    setIsTestStarted(true); // Begin the quiz
  };

  // Submit answers to the backend
  const handleSubmit = () => {
    const selectedAnswers = questions.map((q) => ({
      questionId: q.id,
      questionNo: q.questionNo,
      selectedOption: q.selectedOption, // This now contains the option variable name
    }));

    const submissionData = {
      candidateName, // Include candidate name
      testKey, // Include test key
      answers: selectedAnswers, // Include selected answers
    };

    // Send the submission data to the backend (Spring Boot)
    axios
      .post("http://localhost:8080/api/quiz/submit", submissionData)
      .then(() => {
        setPopupMessage("Quiz Submitted Successfully!");
        setShowPopup(true); // Show success message in the popup
      })
      .catch(() => {
        setPopupMessage("Error submitting quiz.");
        setShowPopup(true); // Show error message in the popup
      });
  };

  // Check if any question has a selected option
  const isSubmitEnabled = questions.some((q) => q.selectedOption !== null);

  return (
    <div className="quiz-container">
      {/* If test hasn't started, show input fields for name and key */}
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
            onChange={(e) => setTestKey(e.target.value)} // Update test key on change
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
          {/* Display Question Status (Question Numbering) */}
          <div className="question-status">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className={`status-indicator ${q.status || "not-checked"}`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>

          {/* Display Current Question */}
          {questions.length > 0 && (
            <div className="question-box">
              <h4>Question {currentQuestion + 1}</h4>
              <p className="question-text">
                {questions[currentQuestion]?.question}
              </p>
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

          {/* Buttons: Mark for Review, Previous, Next, Clear, Submit */}
          <div className="action-buttons">
            <button
              onClick={handleMarkForReview}
              className="quizButton review-btn btn"
            >
              Mark for Review
            </button>
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="quizButton btn btn-secondary"
              disabled={currentQuestion === 0} // Disable if it's the first question
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="quizButton btn btn-primary"
              disabled={currentQuestion === questions.length - 1} // Disable if it's the last question
            >
              Next
            </button>
            <button
              onClick={handleClearSelection}
              className="quizButton clear-btn btn btn-warning"
            >
              Clear
            </button>
            <button
              onClick={handleSubmit}
              className="quizButton submit-btn btn"
              disabled={!isSubmitEnabled} // Enable submission anytime a question is answered
            >
              Submit
            </button>
          </div>
        </>
      )}

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>{popupMessage}</h2>
            <button
              onClick={() => {
                setShowPopup(false);
                setIsTestCompleted(true); // Set test as completed
              }}
              className="btn btn-primary"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;