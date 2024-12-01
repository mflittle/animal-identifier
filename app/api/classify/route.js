import { HfInference } from '@huggingface/inference';
import { NextResponse } from 'next/server';

if (!process.env.HUGGINGFACE_API_KEY) {
  console.error('HUGGINGFACE_API_KEY is not set in environment variables');
}

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request) {
  try {
    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error('Hugging Face API key is not configured');
    }

    const { image } = await request.json();
    const base64Image = image.split(',')[1];
    
    try {
      const result = await hf.imageClassification({
        model: 'google/vit-base-patch16-224',
        data: Buffer.from(base64Image, 'base64'),
      });
      
      // Added rabbit to the animals list
      const animals = ['cat', 'dog', 'elephant', 'lion', 'tiger', 
                      'bear', 'zebra', 'giraffe', 'penguin', 'kangaroo', 'rabbit'];
      
      const animalResult = result.find(r => 
        animals.some(animal => r.label.toLowerCase().includes(animal))
      );
      
      if (!animalResult) {
        return NextResponse.json({ 
          animal: null, 
          message: 'No supported animal detected' 
        });
      }

      return NextResponse.json({
        animal: animalResult.label.toLowerCase(),
        confidence: animalResult.score
      });
    } catch (error) {
      console.error('Hugging Face API error:', error);
      return NextResponse.json(
        { message: 'Error calling Hugging Face API: ' + error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}