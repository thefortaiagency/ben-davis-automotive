import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Generate a friendly, approachable avatar based on Ben Davis
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Create a friendly, professional cartoon avatar of an elderly businessman with glasses, warm smile, wearing a blue sweater over a collared shirt. The style should be approachable and trustworthy, similar to a car dealership owner. Circular avatar style with soft blue background. Professional but warm and welcoming appearance.",
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    const imageUrl = response.data?.[0]?.url || '/bendavis.jpg';
    
    return NextResponse.json({
      imageUrl
    });
  } catch (error) {
    console.error('Avatar generation error:', error);
    // Return a fallback to the actual photo if generation fails
    return NextResponse.json({
      imageUrl: '/bendavis.jpg'
    });
  }
}