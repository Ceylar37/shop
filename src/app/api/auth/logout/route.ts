import {authGuard} from '@/server/utils/auth';
import {User} from '@prisma/client';
import {NextResponse} from 'next/server';

export const POST = authGuard(async (request: Request, user: User) => {
  const response = NextResponse.json({status: 200});

  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    maxAge: -1,
  });

  return response;
});
