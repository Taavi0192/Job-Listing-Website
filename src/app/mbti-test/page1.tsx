// 'use client';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';

// export default function MbtiTestPage() {
//   const [mbtiResult, setMbtiResult] = useState('');
//   const router = useRouter();

//   const handleSaveResult = async () => {
//     // Call the API to save the result to the database
//     const res = await fetch('/api/profile/mbti', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ mbtiResult }),
//     });

//     if (res.ok) {
//       alert('MBTI result saved successfully!');
//       router.push('/profile'); // Redirect back to the profile page
//     } else {
//       alert('Failed to save MBTI result.');
//     }
//   };

//   return (
//     <div style={{ padding: '20px', textAlign: 'center' }}>
//       <h1>Take the MBTI Test</h1>

//       {/* Instructions to take the MBTI test on 16Personalities */}
//       <p>
//         Click the button below to take the MBTI test on 16Personalities. After
//         completing the test, come back and enter your result manually.
//       </p>
//       <button
//         onClick={() => window.open('https://www.16personalities.com/free-personality-test', '_blank')}
//         style={{
//           padding: '10px 20px',
//           backgroundColor: '#0070f3',
//           color: 'white',
//           border: 'none',
//           borderRadius: '5px',
//           cursor: 'pointer',
//           fontSize: '16px',
//           marginTop: '20px',
//         }}
//       >
//         Take MBTI Test on 16Personalities
//       </button>

//       {/* Input for manually entering the MBTI result */}
//       <div style={{ marginTop: '20px' }}>
//         <h3>Enter Your MBTI Result:</h3>
//         <input
//           type="text"
//           value={mbtiResult}
//           onChange={(e) => setMbtiResult(e.target.value)}
//           placeholder="e.g., INTJ"
//           style={{
//             padding: '10px',
//             width: '200px',
//             borderRadius: '5px',
//             marginRight: '10px',
//           }}
//         />
//         <button
//           onClick={handleSaveResult}
//           style={{
//             padding: '10px 20px',
//             backgroundColor: '#0070f3',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//           }}
//         >
//           Save Result
//         </button>
//       </div>
//     </div>
//   );
// }
