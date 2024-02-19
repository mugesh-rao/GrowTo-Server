const Multer = require("multer");
const cloudinary = require('cloudinary').v2;
const storage = new Multer.memoryStorage();
const upload = Multer({ storage });

cloudinary.config({ 
  cloud_name: 'diffu1623', 
  api_key: '921357913348148', 
  api_secret: '_GEunOyK6M7pUkiAFu5fdku2rLg' 
});
async function handleUpload(file, folderName) {
    try {
      // Upload file to Cloudinary
      const res = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
        folder: folderName, 
      });
      return res;
    } catch (error) {
      console.error("Upload to Cloudinary failed:", error);
      throw error;
    }
  }
  
 
  


module.exports = handleUpload;
