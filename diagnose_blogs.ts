import { blogService } from './src/services/blog.service';

async function diagnoseBlogs() {
    try {
        console.log("Fetching all blogs...");
        const allBlogs = await blogService.getAllBlogs();
        console.log("All Blogs Count:", allBlogs.result?.length);
        console.log("All Blogs Detail:", JSON.stringify(allBlogs.result, null, 2));

        console.log("\nFetching published blogs...");
        const publishedBlogs = await blogService.getPublishedBlogs();
        console.log("Published Blogs Count:", publishedBlogs.result?.length);
        console.log("Published Blogs Detail:", JSON.stringify(publishedBlogs.result, null, 2));
    } catch (error) {
        console.error("Error during diagnosis:", error);
    }
}

diagnoseBlogs();
