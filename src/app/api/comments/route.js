import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { postId, content } = await request.json();

    if (!postId || !content) {
      return NextResponse.json(
        { success: false, error: 'Post ID and content are required' },
        { status: 400 }
      );
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId),
        createdAt: new Date()
      }
    });

    if (comment) {
      await prisma.post.update({
        where: { id: parseInt(postId) },
        data: { commentCount: { increment: 1 } }
      });
    }

    // Update post like count
    await prisma.post.update({
      where: { id: parseInt(postId) },
      data: {
        likeCount: {
          increment: 0 // Just to refresh the post
        }
      }
    });


    return NextResponse.json({ 
      success: true, 
      comment,
      message: 'Comment added successfully' 
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    );
  }
} 