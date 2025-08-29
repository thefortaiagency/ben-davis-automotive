import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST() {
  try {
    console.log('🎨 TeamAI Orchestrator: Creating Cars-style dashboard background...');
    
    // Generate Cars movie-style cartoon background
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "NO TEXT OR WORDS ANYWHERE. Create a cartoon-style background inspired by Pixar's Cars movie aesthetic for a car dealership dashboard. Show a stylized cartoon automotive dealership showroom floor with glossy reflective surfaces, soft ambient lighting, and subtle automotive elements like tire tracks patterns on the floor. Use warm colors with burgundy/red accents. The style should be clean, professional yet playful like the Cars movie - smooth gradients, soft shadows, and a slight glossy sheen. Background only, no cars or characters, just the environment. Subtle and not too busy, suitable as a dashboard background.",
      n: 1,
      size: "1792x1024",
      quality: "hd",
      style: "vivid"
    });

    if (response.data?.[0]?.url) {
      const imageUrl = response.data[0].url;
      
      // Download and save the image
      const imageResponse = await fetch(imageUrl);
      const buffer = await imageResponse.arrayBuffer();
      
      const publicPath = path.join(process.cwd(), 'public', 'dashboard-bg.jpg');
      await fs.writeFile(publicPath, Buffer.from(buffer));
      
      console.log('✅ Dashboard background created successfully!');
      
      return NextResponse.json({ 
        success: true, 
        message: 'Cars-style dashboard background created!',
        path: '/dashboard-bg.jpg'
      });
    }
    
    throw new Error('No image URL in response');
  } catch (error) {
    console.error('Error generating dashboard background:', error);
    return NextResponse.json(
      { error: 'Failed to generate dashboard background' },
      { status: 500 }
    );
  }
}