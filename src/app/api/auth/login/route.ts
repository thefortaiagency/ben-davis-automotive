import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Hardcoded users with hashed passwords
// Password for both users: Ben$2025
const users = [
  {
    username: 'aoberlin',
    passwordHash: '$2b$10$jNP.g4icnAEYuC6IZ9.bSOJuJS41/afNfXQ4Hi1dDcOJOfO23cY1G',
    name: 'Andy Oberlin'
  },
  {
    username: 'bdavis',
    passwordHash: '$2b$10$jNP.g4icnAEYuC6IZ9.bSOJuJS41/afNfXQ4Hi1dDcOJOfO23cY1G',
    name: 'Brent Davis'
  }
];

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Find user
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = bcrypt.compareSync(password, user.passwordHash);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Create response with session data
    const response = NextResponse.json({
      success: true,
      user: {
        username: user.username,
        name: user.name
      }
    });

    // Set session cookie on the response
    response.cookies.set('auth-session', JSON.stringify({
      username: user.username,
      name: user.name,
      loggedIn: true
    }), {
      httpOnly: true,
      secure: false, // Set to false for local development
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}