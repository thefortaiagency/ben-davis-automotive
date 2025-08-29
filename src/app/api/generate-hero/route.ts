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
      prompt: "NO TEXT OR SIGNS ANYWHERE IN THE IMAGE. Beautiful automotive heritage photograph showing classic 1930s Auburn Cord Duesenberg luxury car in elegant burgundy or deep blue, positioned alongside modern Chevrolet Silverado, Buick Enclave, and Ford F-150 vehicles on a pristine dealership lot. Golden hour lighting with warm sunset glow. Background shows small-town Indiana courthouse building with clock tower, tree-lined streets, American flag on pole. The classic car should be prominently featured but harmoniously integrated with the modern vehicles. Professional automotive photography style with rich colors, dramatic lighting, depth of field blur on background. Atmosphere should evoke family heritage, trust, and American automotive tradition. ABSOLUTELY NO TEXT, NO DEALERSHIP SIGNS, NO WRITING OF ANY KIND.",
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