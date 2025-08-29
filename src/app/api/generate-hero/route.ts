import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Generate hero image for Ben Davis Automotive
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Professional hero image for Ben Davis Automotive, a trusted family-owned car dealership in Auburn, Indiana. Show a modern, welcoming dealership showroom with gleaming new cars (mix of sedans, SUVs, trucks) under bright lighting. Include the Auburn, Indiana small-town charm with warm, trustworthy atmosphere. Add subtle elements suggesting family heritage and community trust - maybe a small Indiana flag or Auburn town elements. Clean, professional automotive photography style with excellent lighting, welcoming entrance, and cars that represent quality and reliability. High-end commercial automotive photography aesthetic.",
      n: 1,
      size: "1792x1024",
      quality: "hd",
      style: "natural"
    });

    if (response.data?.[0]?.url) {
      // Download and save the image
      const imageUrl = response.data[0].url;
      const imageResponse = await fetch(imageUrl);
      const buffer = await imageResponse.arrayBuffer();
      
      // Save to public folder
      const outputPath = path.join(process.cwd(), 'public', 'hero-image.jpg');
      fs.writeFileSync(outputPath, Buffer.from(buffer));
      
      return NextResponse.json({
        success: true,
        imageUrl: '/hero-image.jpg'
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate image'
    });
  } catch (error) {
    console.error('Hero generation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Generation failed'
    });
  }
}