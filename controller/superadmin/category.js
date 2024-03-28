
const Category = require('../../models/Category.model');
const handleUpload = require('../../utils/mutler');

exports.createCategory = async (req, res) => {
    try {
        const { name, industry, subcategories } = req.body;

        let cldRes = null;

        // Check if there's an image file in the request
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

            // Upload the file to Cloudinary
            cldRes = await handleUpload(dataURI, "Categories"); // Assuming 'Categories' is your Cloudinary folder for category images
        }

        const newCategory = new Category({
            name,
            industry,
            imgUrl: cldRes ? cldRes.secure_url : '', // Use the secure_url from Cloudinary response if available
            subcategories: subcategories ? JSON.parse(subcategories) : [] // Assuming subcategories are provided as a JSON string
        });

        await newCategory.save();
        res.status(201).json({ status: "success", message: "Category added successfully", category: newCategory });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ status: "error", error: "Failed to create category" });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a category and optionally its subcategories
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, industry, subcategories } = req.body;
    let imageUrl = '';

    try {
        // Check for an image file in the request
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        const updatedData = {
            name,
            industry,
            ...(imageUrl && { imgUrl: imageUrl }), // Only add imgUrl if there's a new image
            ...(subcategories && { subcategories: JSON.parse(subcategories) }) // Only update subcategories if provided
        };

        const updatedCategory = await Category.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(204).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Optional: Add methods for specifically managing subcategories if necessary,
// such as adding a new subcategory to an existing category,
// updating a subcategory, or removing a subcategory.
