import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Blog } from './entities/blog.entity';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { RoleEnum } from 'src/role/enum/role.enum';

@ApiTags('Blog')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({
    summary: 'Create a new blog (Admin only)',
  })
  @ApiCreatedResponse({
    description: 'Blog has been successfully created',
    type: Blog,
  })
  @Post()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  createBlog(@Body() createBlogDto: CreateBlogDto): Promise<Blog> {
    return this.blogService.createBlog(createBlogDto);
  }

  @ApiOperation({
    summary: 'Get all blogs',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all blogs',
    type: [Blog],
  })
  @Get()
  getAllBlogs(): Promise<Blog[]> {
    return this.blogService.getAllBlogs();
  }

  @ApiOperation({
    summary: 'Get a blog by ID',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the blog',
    type: Blog,
  })
  @ApiNotFoundResponse({
    description: 'Blog with ID ${blogId} not found',
  })
  @Get(':blogId')
  getBlogById(@Param('blogId') blogId: string): Promise<Blog> {
    return this.blogService.getBlogById(blogId);
  }

  @ApiOperation({
    summary: 'Update a blog by ID (Admin only)',
  })
  @ApiOkResponse({
    description: 'Blog has been successfully updated',
    type: Blog,
  })
  @ApiNotFoundResponse({
    description: 'Blog with ID ${blogId} not found',
  })
  @Put(':blogId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  updateBlog(
    @Param('blogId') blogId: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<Blog> {
    return this.blogService.updateBlog(blogId, updateBlogDto);
  }

  @ApiOperation({
    summary: 'Delete a blog by ID (Admin only)',
  })
  @ApiOkResponse({
    description: 'Blog has been successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Blog with ID ${blogId} not found',
  })
  @Delete(':blogId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  deleteBlog(@Param('blogId') blogId: string): Promise<string> {
    return this.blogService.deleteBlog(blogId);
  }
}
