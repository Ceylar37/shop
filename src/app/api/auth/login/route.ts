import {LoginData} from '@/schemas/LoginData';
import prisma from '@/server';
import {createToken} from '@/server/utils';
import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  const payload: LoginData = await request.json();

  const user = await prisma.user.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (!user) {
    return NextResponse.json(
      {message: 'User not found', status: 401},
      {
        status: 401,
      }
    );
  }

  const {password, token: userToken, ...userData} = user;

  if (payload.password !== password) {
    return NextResponse.json(
      {
        message: 'Wrong password',
        status: 401,
      },
      {status: 401}
    );
  }

  const token = createToken(userData);

  await prisma.user.update({
    where: {
      name: payload.name,
    },
    data: {
      token,
    },
  });

  const response = NextResponse.json(
    {
      ...userData,
    },
    {status: 200}
  );

  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 2,
  });

  return response;
}
