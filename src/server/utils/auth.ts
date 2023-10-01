import {Role, User} from '@prisma/client';
import jwt from 'jsonwebtoken';
import {NextRequest, NextResponse} from 'next/server';
import {parseCookies} from '.';
import prisma from '..';

export const authGuard = <T>(
  routeHandler: (request: NextRequest, user: User) => Promise<NextResponse<T | {message: string; status: number}>>,
  allowedRoles?: Role[]
) => {
  return async (request: NextRequest) => {
    const {token} = parseCookies(request.headers.get('Cookie') ?? '');
    if (!token) {
      return NextResponse.json({message: 'Unauthorized', status: 401}, {status: 401});
    }

    const userData = jwt.decode(token);

    if (!userData || typeof userData !== 'object' || !('id' in userData)) {
      return NextResponse.json({message: 'Unauthorized', status: 401}, {status: 401});
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userData.id,
      },
    });

    if (!user) {
      return NextResponse.json({message: 'Unauthorized', status: 401}, {status: 401});
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return NextResponse.json({message: 'Forbidden', status: 403}, {status: 403});
    }

    return await routeHandler(request, user);
  };
};
