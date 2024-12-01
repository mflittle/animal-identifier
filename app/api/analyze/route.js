import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { animal } = await request.json();
    
    // Special handling for rabbits
    if (animal.includes('rabbit')) {
      return NextResponse.json({
        analysis: `According to the Rabbit of Caerbannog article, while most rabbits are harmless, there exists a legendary rabbit that is "the most foul, cruel, and bad-tempered rodent you ever set eyes on." This particular rabbit has been known to be capable of killing humans in a most unpleasant fashion. However, the likelihood of encountering this specific rabbit is extremely low, as it was last seen guarding the Cave of Caerbannog. Regular rabbits are completely harmless to humans.`,
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Rabbit_of_Caerbannog'
      });
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      temperature: 0.7,
      messages: [{
        role: "system",
        content: `You are an AI agent that analyzes if animals are dangerous to humans. 
                 You MUST respond using EXACTLY this template, replacing the text in brackets:

                 ANALYSIS: [Write a 2-3 sentence analysis of whether the animal is dangerous to humans]

                 WIKIPEDIA: https://en.wikipedia.org/wiki/[Animal_Name]

                 Do not deviate from this format. Always include both the ANALYSIS and WIKIPEDIA sections.
                 The Wikipedia URL should be the main article for the animal species.`
      }, {
        role: "user",
        content: `Analyze if a ${animal} is dangerous to humans.`
      }]
    });

    const response = completion.choices[0].message.content;
    console.log('OpenAI Response:', response); // Debug logging
    
    let analysis = '';
    let wikipediaUrl = '';
    
    // More robust parsing
    if (response.includes('ANALYSIS:')) {
      analysis = response.split('ANALYSIS:')[1].split('WIKIPEDIA:')[0].trim();
    }
    
    if (response.includes('WIKIPEDIA:')) {
      wikipediaUrl = response.split('WIKIPEDIA:')[1].trim();
    }

    console.log('Parsed Analysis:', analysis); // Debug logging
    console.log('Parsed URL:', wikipediaUrl); // Debug logging

    // Fallback URLs if no URL was found
    const fallbackUrls = {
      cat: 'https://en.wikipedia.org/wiki/Cat',
      dog: 'https://en.wikipedia.org/wiki/Dog',
      elephant: 'https://en.wikipedia.org/wiki/Elephant',
      lion: 'https://en.wikipedia.org/wiki/Lion',
      tiger: 'https://en.wikipedia.org/wiki/Tiger',
      bear: 'https://en.wikipedia.org/wiki/Bear',
      zebra: 'https://en.wikipedia.org/wiki/Zebra',
      giraffe: 'https://en.wikipedia.org/wiki/Giraffe',
      penguin: 'https://en.wikipedia.org/wiki/Penguin',
      kangaroo: 'https://en.wikipedia.org/wiki/Kangaroo'
    };

    // If no valid URL was found, use fallback
    if (!wikipediaUrl || !wikipediaUrl.startsWith('https://')) {
      const normalizedAnimal = animal.toLowerCase();
      if (normalizedAnimal in fallbackUrls) {
        wikipediaUrl = fallbackUrls[normalizedAnimal];
        console.log('Using fallback URL:', wikipediaUrl); // Debug logging
      }
    }

    const responseData = {
      analysis: analysis || response,
      wikipediaUrl: wikipediaUrl || null
    };

    console.log('Final response:', responseData); // Debug logging

    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}