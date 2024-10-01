import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<Blog>,
  ) {}

  // Create a new blog
  async createBlog(createBlogDto: CreateBlogDto): Promise<Blog> {
    const newBlog = new this.blogModel(createBlogDto);
    return await newBlog.save();
  }

  // Get all blogs
  async getAllBlogs(): Promise<Blog[]> {
    return await this.blogModel.find().exec();
  }

  // Get a blog by ID
  async getBlogById(blogId: string): Promise<Blog> {
    const blog = await this.blogModel.findById(blogId).exec();
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found`);
    }
    return blog;
  }

  // Update a blog by ID
  async updateBlog(
    blogId: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<Blog> {
    const updatedBlog = await this.blogModel
      .findByIdAndUpdate(blogId, updateBlogDto, { new: true })
      .exec();
    if (!updatedBlog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found`);
    }
    return updatedBlog;
  }

  // Delete a blog by ID
  async deleteBlog(blogId: string): Promise<string> {
    const result = await this.blogModel.findByIdAndDelete(blogId).exec();
    if (!result) {
      throw new NotFoundException(`Blog with ID ${blogId} not found`);
    }
    return `Blog with ID ${blogId} deleted`;
  }
}
