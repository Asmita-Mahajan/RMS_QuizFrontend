"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Quiz.css";

const Quiz = () => {
  const [questions, setQuestions] = useState([]); // Store all quiz questions
  const [currentQuestion, setCurrentQuestion] = useState(0); // Track the current question
  const [candidateName, setCandidateName] = useState(""); // Candidate's name
  const [testKey, setTestKey] = useState(""); // Candidate's test key
  const [isTestStarted, setIsTestStarted] = useState(false); // Flag to check if the test has started
  const [error, setError] = useState(""); // Error message for validation
  const [isTestCompleted, setIsTestCompleted] = useState(false); // Flag to check if the test is completed
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  // Fetch quiz questions
  useEffect(() => {
    axios
      .get("http://localhost:8085/api/quiz/all") // Replace with your Spring Boot API endpoint
      .then((response) => {
        const questionsWithStatus = response.data.map((q) => ({
          ...q,
          status: "not-visited", // Add default status for each question
          selectedOption: null, // Initialize with no option selected
        }));
        setQuestions(questionsWithStatus); // Set the questions from the backend
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
  const remainingQuestions =
    isTestStarted && questions.length > 0
      ? questions.filter((q) => q.status === "not-visited")
      : [];

  const notVisitedQuestions =
    isTestStarted && questions.length > 0
      ? questions.filter((q) => q.status === "not-visited")
      : [];

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

  // const startQuiz = () => {
  //   if (!candidateName.trim() || !testKey.trim()) {
  //     setError("Please enter both your name and test key.");
  //     return;
  //   }
  //   setError(""); // Clear error message
  //   setIsTestStarted(true); // Begin the quiz
  // };

  // Start the quiz after validation
  const startQuiz = () => {
    if (!candidateName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!testKey.trim()) {
      setError("Please enter the test key.");
      return;
    }

    
    // Validate candidate
    axios
      .get(`http://localhost:8085/api/quiz/validate`, {
        params: { candidateName, testKey },
      })
      .then((response) => {
        if (response.data) {
          setError(""); // Clear error message
          setIsTestStarted(true); // Begin the quiz
        } else {
          setError("Invalid candidate name or test key.");
        }
      })
      .catch(() => {
        setError("Error validating candidate.");
      });
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
      .post("http://localhost:8085/api/quiz/submit", submissionData)
      .then(() => {

        setIsTestCompleted(true);
      })
      .catch(() => {
        setIsTestCompleted(false);
        alert("Error Submitting your Quiz")
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
        <div className="start-test-page">
          <div className="start-test">
            <h2>Welcome to the Quiz</h2>
            <p>Please enter your details to begin.</p>

            <input
              type="text"
              placeholder="Enter your name"
              value={candidateName}
              onChange={(e) => {
                setCandidateName(e.target.value); // Update name with any input
              }}
              className={error.includes("name") ? "error-input" : ""}
            />

            <input
              type="text"
              placeholder="Enter test key"
              value={testKey}
              onChange={(e) => setTestKey(e.target.value)}
              className={error.includes("test key") ? "error-input" : ""}
            />

            {error && <p className="error-message">{error}</p>}

            <button onClick={startQuiz} className="start-button">
              Start Test
            </button>
          </div>
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
                      className={`option ${questions[currentQuestion]?.selectedOption === key
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
                    className={`question-button ${currentQuestion === index ? "active" : ""
                      } ${question.status === "review" ? "marked-for-review" : ""
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
                <span>Answered:</span>{" "}
                <span>{isTestStarted ? answeredQuestions.length : 0}</span>
              </div>
              <div>
                <span>Marked for Review:</span>{" "}
                <span>{isTestStarted ? markedQuestions.length : 0}</span>
              </div>
              <div>
                <span>Remaining to Answer:</span>{" "}
                <span>{isTestStarted ? remainingQuestions.length : 0}</span>
              </div>
              <div>
                <span>Not Visited:</span>{" "}
                <span>{isTestStarted ? notVisitedQuestions.length : 0}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
