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
      prompt: "Heritage-focused hero image capturing the Ben Davis Automotive legacy in Auburn, Indiana - 'Home of the Classics'. Create a warm, nostalgic composition that blends Auburn's classic automotive heritage with family dealership tradition. Show a classic 1930s Auburn Cord Duesenberg-style vintage car in the foreground (honoring Auburn's automotive golden age), alongside modern Chevrolet, Buick, and Ford vehicles, symbolizing how Ben Davis connects Auburn's past to its present. Include the Auburn town square or courthouse in the soft-focus background, warm golden hour lighting suggesting trust and community values, maybe an American flag or 'Auburn - Home of the Classics' sign subtly visible. The image should feel like a tribute to entrepreneurial spirit, family values, and community dedication - capturing the essence of why Ben Davis (1937-2014) was inducted into the DeKalb County Business Hall of Fame. Style: Cinematic, warm tones, heritage documentary photography that honors both automotive history and family legacy.",
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