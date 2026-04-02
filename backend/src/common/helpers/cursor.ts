import { BadRequestException } from '@nestjs/common';

export function encodeCursor(createdAt: Date, id: string): string {
  return Buffer.from(
    JSON.stringify({ createdAt: createdAt.toISOString(), id }),
  ).toString('base64url');
}

export function decodeCursor(cursor: string): { createdAt: Date; id: string } {
  try {
    const parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString());
    return {
      createdAt: new Date(parsed.createdAt),
      id: parsed.id,
    };
  } catch (error) {
    throw new BadRequestException('Invalid cursor');
  }
}
