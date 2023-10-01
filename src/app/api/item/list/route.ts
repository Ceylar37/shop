import prisma from '@/server';
import {authGuard} from '@/server/utils/auth';
import {NextRequest, NextResponse} from 'next/server';

export const GET = authGuard(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const skip = Number(searchParams.get('skip')) || 0;
  const take = Number(searchParams.get('take')) || 20;
  const search = searchParams.get('search') ?? undefined;

  const items = await prisma.item.findMany({skip, take, where: {name: {contains: search, mode: 'insensitive'}}});

  return NextResponse.json(items, {
    status: 200,
  });
});
