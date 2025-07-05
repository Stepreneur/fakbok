import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Increment like count
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(postId) },
      data: {
        likeCount: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      likeCount: updatedPost.likeCount,
      message: 'Post liked successfully' 
    });

  } catch (error) {
    console.error('Error liking post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to like post' },
      { status: 500 }
    );
  }
} 