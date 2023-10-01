import prisma from '@/server';
import {authGuard} from '@/server/utils/auth';
import {NextRequest, NextResponse} from 'next/server';

export const GET = authGuard(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id') || '';

  const item = await prisma.item.findFirst({
    where: {
      id,
    },
  });

  if (!item) {
    return NextResponse.json(
      {
        message: 'Item not found',
        status: 404,
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(item, {
    status: 200,
  });
});
