import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

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

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-session', JSON.stringify({
      username: user.username,
      name: user.name,
      loggedIn: true
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}