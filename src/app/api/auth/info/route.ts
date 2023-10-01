import {authGuard} from '@/server/utils/auth';
import {User} from '@prisma/client';
import {NextResponse} from 'next/server';

export const GET = authGuard(async (request: Request, {password, token, ...userData}: User) => {
  return NextResponse.json({...userData});
});
