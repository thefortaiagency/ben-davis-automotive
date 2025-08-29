import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Generate a cartoon avatar based on Ben Davis's appearance
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Create a friendly cartoon avatar of a smiling elderly man with glasses, gray/white hair, wearing a blue sweater. The style should be like a Pixar character or friendly illustrated mascot. Round face, warm smile, professional but approachable. Head and shoulders view. Clean, simple cartoon style with soft colors. Background should be light blue or white.",
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid"
    });

    if (response.data[0]?.url) {
      // Download and save the image
      const imageUrl = response.data[0].url;
      const imageResponse = await fetch(imageUrl);
      const buffer = await imageResponse.arrayBuffer();
      
      // Save to public folder
      const outputPath = path.join(process.cwd(), 'public', 'ben-cartoon.png');
      fs.writeFileSync(outputPath, Buffer.from(buffer));
      
      return NextResponse.json({
        success: true,
        imageUrl: '/ben-cartoon.png'
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate image'
    });
  } catch (error) {
    console.error('Cartoon generation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Generation failed'
    });
  }
}