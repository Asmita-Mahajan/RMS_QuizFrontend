// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
//               app/page.tsx
//             </code>
//             .
//           </li>
//           <li>Save and see your changes instantly.</li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }


import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react'
import Quiz from "./components/Quiz"; 
const page = () => {
  return (
    <div>
      <Quiz></Quiz>
    </div>
  )
}

export default page



// "use client";
// import React, { useState } from "react";
// import questionsData from "../data/questions.json";
// import styles from "./styles/Quiz.module.css";



// const Quiz = () => {
//   const [questions, setQuestions] = useState(questionsData);
//   const [currentQuestion, setCurrentQuestion] = useState(0);

//   const updateStatus = (index, status) => {
//     const updatedQuestions = questions.map((q, idx) =>
//       idx === index ? { ...q, status } : q
//     );
//     setQuestions(updatedQuestions);
//   };

//   const handleOptionSelect = (option) => {
//     const updatedQuestions = questions.map((q, index) => {
//       if (index === currentQuestion) {
//         return { ...q, selectedOption: option, status: "attended" };
//       }
//       return q;
//     });
//     setQuestions(updatedQuestions);
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestion(index);
//   };

//   const handleNext = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//     }
//   };

//   const handlePrev = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(currentQuestion - 1);
//     }
//   };

//   const handleClear = () => {
//     const updatedQuestions = questions.map((q, index) => {
//       if (index === currentQuestion) {
//         return { ...q, selectedOption: null, status: "not-checked" };
//       }
//       return q;
//     });
//     setQuestions(updatedQuestions);
//   };

//   const handleSubmit = () => {
//     console.log("Submitted Answers:", questions);
//     alert("Quiz Submitted!");
//   };

//   return (
//     <div className={styles.quizContainer}>
//       <div className={styles.questionStatus}>
//         {questions.map((q, index) => (
//           <div
//             key={q.id}
//             className={`${styles.statusIndicator} ${styles[q.status]}`}
//             onClick={() => handleQuestionClick(index)}
//           >
//             {index + 1}
//           </div>
//         ))}
//       </div>
//       <div className={styles.questionBox}>
//         <h2>Question {currentQuestion + 1}</h2>
//         <p className={styles.questionText}>{questions[currentQuestion].text}</p>
//         <div className={styles.options}>
//           {questions[currentQuestion].options.map((option, idx) => (
//             <div
//               key={idx}
//               className={`${styles.option} ${
//                 questions[currentQuestion].selectedOption === option
//                   ? styles.selected
//                   : ""
//               }`}
//               onClick={() => handleOptionSelect(option)}
//             >
//               {option}
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className={styles.actionButtons}>
//         <button
//           onClick={() => updateStatus(currentQuestion, "review")}
//           className={styles.reviewBtn}
//           disabled={!questions[currentQuestion].selectedOption}
//         >
//           Mark as Review
//         </button>
//         <button onClick={handleClear} className={styles.notCheckedBtn}>
//           Clear
//         </button>
//       </div>
//       <div className={styles.navigationButtons}>
//         <button onClick={handlePrev} disabled={currentQuestion === 0}>
//           Previous
//         </button>
//         <button
//           onClick={handleNext}
//           disabled={currentQuestion === questions.length - 1}
//         >
//           Next
//         </button>
//         <button onClick={handleSubmit} className={styles.submitBtn}>
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Quiz;
