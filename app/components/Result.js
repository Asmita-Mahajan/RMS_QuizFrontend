


// "use client"

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../styles/result.css';

// const Result = () => {
//   const [candidateResults, setCandidateResults] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.post('http://localhost:8082/api/results/save');
//         console.log(response.data); // Log the response data
//         setCandidateResults(response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false); // Set loading to false after fetching
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>; // Show loading state
//   }

//   // Extract unique question types from candidate results
//   const questionTypes = new Set();
//   candidateResults.forEach(result => {
//     if (result.testStatus === 'COMPLETED' && result.questionTypePercentages) {
//       Object.keys(result.questionTypePercentages).forEach(type => questionTypes.add(type));
//     }
//   });

//   return (
//     <div>
//       <table>
//         <thead>
//           <tr>
//             <th>Candidate Name</th>
//             <th>Test Key</th>
//             <th>Score</th>
//             {/* Render question type headers */}
//             {[...questionTypes].map(type => (
//               <th key={type}>{type}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {candidateResults
//             .filter(result => result.testStatus === 'COMPLETED') // Filter for completed tests
//             .map(result => (
//               <tr key={result.candidateName}> {/* Use 'id' as the key for the row */}
//                 <td>{result.candidateName}</td>
//                 {/* <td>{result.testKey}</td> */}
//                 <td>{result.score}</td>
//                 {/* Render percentages for each question type */}
//                 {[...questionTypes].map(type => (
//                   <td key={type + result.id}> {/* Combine type and id for unique key */}
//                     {result.questionTypePercentages[type] ? result.questionTypePercentages[type].toFixed(2) : 'N/A'}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Result;

"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/result.css';

const Result = () => {
  const [candidateResults, setCandidateResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:8082/api/results/save');
        console.log(response.data); // Log the response data
        setCandidateResults(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  // Extract unique question types from candidate results
  const questionTypes = new Set();
  candidateResults.forEach(result => {
    if (result.testStatus === 'COMPLETED' && result.questionTypePercentages) {
      Object.keys(result.questionTypePercentages).forEach(type => questionTypes.add(type));
    }
  });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Test Key</th>
            <th>Score</th>
            {/* Render question type headers */}
            {[...questionTypes].map(type => (
              <th key={type}>{type}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {candidateResults
            .filter(result => result.testStatus === 'COMPLETED') // Filter for completed tests
            .map(result => {
              const uniqueRowKey = result.id || Math.random(); // Fallback to random if id is null
              return (
                <tr key={uniqueRowKey}>
                  <td>{result.candidateName}</td>
                  <td>{result.testKey}</td>
                  <td>{result.score}</td>
                  {[...questionTypes].map(type => {
                    const uniqueCellKey = `${type}-${uniqueRowKey}`; // Combine type and row key for unique cell key
                    const percentage = result.questionTypePercentages[type]; // Get the percentage
                    return (
                      <td key={uniqueCellKey}> {/* Ensure unique key for each cell */}
                        {percentage !== undefined ? percentage.toFixed(2) : 0} {/* Check if percentage exists */}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Result;