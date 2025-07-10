import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import cloudinary from 'cloudinary';

// Cloudinary config (requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const formData = await request.formData();
    const content = formData.get('content');
    const tag = parseInt(formData.get('tag')) || 0;
    const igLink = formData.get('igLink') || null;
    const image = formData.get('image');

    let src = null;

    // Handle image upload if provided
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      try {
        // Upload to Cloudinary
        const uploadResult = await cloudinary.v2.uploader.upload_stream({
          folder: 'fakbok',
          resource_type: 'image',
        }, (error, result) => {
          if (error) throw error;
          return result;
        });
        // Use a Promise wrapper for upload_stream
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream({
            folder: 'fakbok',
            resource_type: 'image',
          }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
          stream.end(buffer);
        });
        src = result.secure_url;
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        return NextResponse.json(
          { success: false, error: 'Failed to upload image to Cloudinary' },
          { status: 500 }
        );
      }
    }

    // Create post in database
    const post = await prisma.post.create({
      data: {
        content,
        tag,
        src,
        igLink,
        createdAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      post,
      message: 'Post created successfully' 
    });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    const postId = searchParams.get('postId');

    // If postId is provided, get specific post with comments
    if (postId) {
      const post = await prisma.post.findUnique({
        where: { id: parseInt(postId) },
        include: {
          comments: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!post) {
        return NextResponse.json(
          { success: false, error: 'Post not found' },
          { status: 404 }
        );
      }

      // Calculate time ago
      const now = new Date();
      const postTime = new Date(post.createdAt);
      const diffInMs = now - postTime;
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      
      let timeAgo = '';
      if (diffInHours > 0) {
        timeAgo = `${diffInHours} ชั่วโมง`;
        if (diffInMinutes > 0) {
          timeAgo += ` ${diffInMinutes} นาที`;
        }
      } else {
        timeAgo = `${diffInMinutes} นาที`;
      }

      return NextResponse.json({ 
        success: true, 
        post: { ...post, timeAgo }
      });
    }

    // Calculate 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Get posts from last 24 hours with pagination
    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: twentyFourHoursAgo
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Get total count for pagination
    const totalPosts = await prisma.post.count({
      where: {
        createdAt: {
          gte: twentyFourHoursAgo
        }
      }
    });

    // Calculate time ago for each post
    const postsWithTimeAgo = posts.map(post => {
      const now = new Date();
      const postTime = new Date(post.createdAt);
      const diffInMs = now - postTime;
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      
      let timeAgo = '';
      if (diffInHours > 0) {
        timeAgo = `${diffInHours} ชั่วโมง`;
        if (diffInMinutes > 0) {
          timeAgo += ` ${diffInMinutes} นาที`;
        }
      } else {
        timeAgo = `${diffInMinutes} นาที`;
      }
      return {
        ...post,
        timeAgo
      };
    });

    return NextResponse.json({ 
      success: true, 
      posts: postsWithTimeAgo,
      pagination: {
        page,
        limit,
        total: totalPosts,
        hasMore: skip + limit < totalPosts
      }
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}