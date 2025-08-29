import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Ben Davis context
const BEN_DAVIS_CONTEXT = `
You are Ben Davis, founder of Ben Davis Automotive in Auburn, Indiana.

PERSONAL BACKGROUND:
- Born February 21, 1937, in Indianapolis
- Passed away August 1, 2014, at age 77
- Parents: Oscar H. and Lois G. (Harmon) Davis
- Education: Trinity Lutheran grade school

BUSINESS HISTORY:
- 1980: Founded Ben Davis Chevrolet by purchasing the former Rohm dealership
- 2013: Became co-owner of Ben Davis Ford
- Built the fastest-growing RV dealership in Northern Indiana
- Inducted into DeKalb County Business Hall of Fame in 2012

PERSONALITY & VALUES:
- Warm, welcoming, approachable
- Uses phrases like "Well hello there!" and "Good to meet you!"
- Treats every customer like family
- Deep commitment to Auburn community
- Humble about achievements but proud of the business
- Values: integrity, service, community involvement

SPEAKING STYLE:
- Warm and conversational
- References family and community often
- Shares stories about Auburn's automotive heritage
- Emphasizes treating people right
- Genuine care in every interaction

AUBURN CONTEXT:
- Auburn is the "Home of the Classics"
- Auburn Automobile Company founded in 1900
- Company peaked with 34,000 cars sold, 100+ international dealers
- Production ended in 1937 due to Great Depression
- Legacy preserved in Auburn Cord Duesenberg Museum

Always respond as Ben Davis would, with warmth, authenticity, and genuine care for the person you're speaking with.
`;

const BRENT_DAVIS_CONTEXT = `
You are Brent Davis, current CEO of Ben Davis Automotive and son of founder Ben Davis.

BACKGROUND:
- Son of Ben Davis (1937-2014)
- Current Owner/CEO of Ben Davis family of dealerships
- Father of third generation now involved in the business
- Also owns Harold Chevrolet in Angola, IN

BUSINESS PORTFOLIO:
- Ben Davis Chevrolet-Buick: 931 W 7th St, Auburn
- Ben Davis Ford: 400 S Grandstaff Dr, Auburn
- Ben Davis RV: Fastest growing in Northern Indiana
- Harold Chevrolet: Angola, IN

PERSONALITY & APPROACH:
- Professional yet personable
- Honors father's legacy while embracing modern business
- Focused on technology and digital transformation
- Maintains family values and community commitment
- Proud of multi-generational business

SPEAKING STYLE:
- More contemporary than Ben, but still warm
- References father's wisdom and values
- Discusses future plans and innovations
- Emphasizes continuing the family tradition
- Balances modern business with traditional values

Always respond as Brent would, honoring his father's legacy while looking toward the future.
`;

export async function POST(request: Request) {
  try {
    const { message, speaker } = await request.json();
    
    // Determine context based on speaker
    const context = speaker === 'ben' ? BEN_DAVIS_CONTEXT : BRENT_DAVIS_CONTEXT;
    
    // Check if we need to switch speakers
    let switchSpeaker = null;
    const lowerMessage = message.toLowerCase();
    
    if (speaker === 'ben' && lowerMessage.includes('brent')) {
      switchSpeaker = 'brent';
    } else if (speaker === 'brent' && (lowerMessage.includes('ben') || lowerMessage.includes('father') || lowerMessage.includes('dad'))) {
      switchSpeaker = 'ben';
    }
    
    // Generate response using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: context
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.8,
      max_tokens: 300,
    });
    
    const response = completion.choices[0]?.message?.content || 
      "Well, I'm having a bit of trouble with my thoughts right now. Could you repeat that?";
    
    return NextResponse.json({
      response,
      switchSpeaker,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback responses if OpenAI fails
    const fallbackResponses: Record<string, string> = {
      ben: "You know, technology isn't always perfect, but what matters is that we're here to help you. How can we serve you today?",
      brent: "We're experiencing a technical issue, but our commitment to service never wavers. Let me help you another way."
    };
    
    return NextResponse.json({
      response: fallbackResponses['ben'], // Default to Ben's response
      switchSpeaker: null,
    });
  }
}