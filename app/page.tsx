'use client';

import { useState } from 'react';
import Image from 'next/image';

interface AnalysisResult {
 animal: string;
 confidence: number;
 analysis: string;
 wikipediaUrl: string;
}

export default function Home() {
 const [selectedImage, setSelectedImage] = useState<File | null>(null);
 const [imageUrl, setImageUrl] = useState<string>('');
 const [loading, setLoading] = useState<boolean>(false);
 const [result, setResult] = useState<AnalysisResult | null>(null);
 const [error, setError] = useState<string>('');

 const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0];
   
   if (!file) return;
   
   if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
     setError('Please upload only JPG/JPEG images');
     return;
   }
   
   setSelectedImage(file);
   setImageUrl(URL.createObjectURL(file));
   setError('');
 };

 const handleUpload = async () => {
   if (!selectedImage) return;
   
   // Clear previous results
   setResult(null);
   setLoading(true);
   setError('');
   
   try {
     // Convert image to base64
     const reader = new FileReader();
     reader.readAsDataURL(selectedImage);
     
     reader.onloadend = async () => {
       try {
         // First classify the image
         const classifyRes = await fetch('/api/classify', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({ image: reader.result }),
         });
         
         const classifyData = await classifyRes.json();
         console.log('Classify response data:', classifyData);
         
         if (!classifyData.animal) {
           setError('No supported animal detected in the image');
           setLoading(false);
           return;
         }
         
         // Then analyze if dangerous
         const analyzeRes = await fetch('/api/analyze', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({ animal: classifyData.animal }),
         });
         
         const analyzeData = await analyzeRes.json();
         console.log('Analyze response data:', analyzeData);
         
         setResult({
           animal: classifyData.animal,
           confidence: classifyData.confidence,
           analysis: analyzeData.analysis,
           wikipediaUrl: analyzeData.wikipediaUrl
         });
       } catch (err) {
         setError('An error occurred while processing the image');
         console.error(err);
       }
       setLoading(false);
     };
   } catch (err) {
     setError('An error occurred while reading the image');
     setLoading(false);
   }
 };

 return (
   <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
     <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
       <h1 className="text-2xl font-bold mb-8 text-center">
         Animal Identifier
       </h1>
       
       <div className="space-y-6">
         <div>
           <label className="block text-sm font-medium text-gray-700">
             Upload Animal Image (JPG/JPEG only)
           </label>
           <input
             type="file"
             accept=".jpg,.jpeg"
             onChange={handleImageChange}
             className="mt-1 block w-full"
           />
         </div>
         
         {imageUrl && (
           <div className="relative h-64 w-full">
             <Image
               src={imageUrl}
               alt="Preview"
               fill
               className="object-contain"
               unoptimized
             />
           </div>
         )}
         
         <button
           onClick={handleUpload}
           disabled={!selectedImage || loading}
           className="w-full bg-blue-500 text-white py-2 px-4 rounded-md
                    hover:bg-blue-600 disabled:bg-gray-400"
         >
           {loading ? 'Processing...' : 'Analyze Image'}
         </button>
         
         {error && (
           <div className="text-red-500 text-sm">
             {error}
           </div>
         )}
         
         {result && (
           <div className="space-y-4">
             <div className="border-t pt-4">
               <h2 className="font-semibold">Results:</h2>
               <p>Detected Animal: {result.animal}</p>
               <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
               <div className="mt-2">
                 <p>{result.analysis}</p>
                 {result.wikipediaUrl && (
                   <p className="mt-4">
                     <a 
                       href={result.wikipediaUrl}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-blue-600 hover:text-blue-800 underline"
                     >
                       Read more on Wikipedia →
                     </a>
                   </p>
                 )}
               </div>
             </div>
           </div>
         )}
       </div>
     </div>
   </div>
 );
}