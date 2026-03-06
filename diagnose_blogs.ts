// Test script để kiểm tra API blogs
import { blogService } from './src/services';

async function testBlogAPI() {
  console.log('=== TESTING BLOG API ===');
  
  try {
    // Test 1: Lấy danh sách blogs published
    console.log('\n1. Testing getPublishedBlogs...');
    const publishedBlogs = await blogService.getPublishedBlogs();
    console.log('Published blogs response:', publishedBlogs);
    
    if (publishedBlogs.result && publishedBlogs.result.length > 0) {
      const firstBlog = publishedBlogs.result[0];
      console.log('First blog:', firstBlog);
      
      // Test 2: Lấy chi tiết blog đầu tiên
      console.log(`\n2. Testing getBlogById with ID: ${firstBlog.id}...`);
      const blogDetail = await blogService.getBlogById(firstBlog.id);
      console.log('Blog detail response:', blogDetail);
      
      if (blogDetail.result) {
        console.log('✅ Blog detail loaded successfully');
        console.log('Title:', blogDetail.result.title);
        console.log('Content length:', blogDetail.result.content.length);
      } else {
        console.log('❌ No result in blog detail response');
      }
    } else {
      console.log('❌ No published blogs found');
    }
    
  } catch (error) {
    console.error('❌ API Test failed:', error);
  }
}

// Chạy test khi file được import
testBlogAPI();