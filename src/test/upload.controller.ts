import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// Swagger ইমপোর্টসমূহ
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Upload') // Swagger-এ আপলোড সেকশন তৈরি করবে
@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'একটি ফাইল আপলোড করুন' })
  @ApiConsumes('multipart/form-data') // Swagger-কে বলবে এটি ফাইল আপলোড
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          // এখানে 'file' নামটি আপনার ইন্টারসেপ্টরের সাথে মিল থাকতে হবে
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'ফাইল সফলভাবে আপলোড হয়েছে।' })
  @ApiResponse({ status: 400, description: 'ভুল ফাইল ফরম্যাট বা রিকোয়েস্ট।' })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return { message: 'File uploaded', filename: file.originalname };
  }
}
