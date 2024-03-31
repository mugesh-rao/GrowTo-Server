
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

exports.addSubcategory = async (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.body; // The new subcategory name

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        let imgUrl = ''; // Placeholder for the image URL

        // Check if there's an image file in the request
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;

            // Upload the file to Cloudinary
            const cldRes = await handleUpload(dataURI, "Subcategories"); // Adjust the folder as needed
            imgUrl = cldRes ? cldRes.secure_url : ''; // Use the secure_url from Cloudinary response if available
        }

        // Push new subcategory with name and optionally imgUrl if an image was uploaded
        category.subcategories.push({ name, imgUrl });

        await category.save();
        res.status(201).json({ message: 'Subcategory added successfully', category });
    } catch (error) {
        console.error("Error adding subcategory:", error);
        res.status(500).json({ error: 'Failed to add subcategory' });
    }
};

exports.updateSubcategory = async (req, res) => {
    const { categoryId, subcategoryId } = req.params;
    const { name, imgUrl } = req.body;

    try {
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const subcategoryIndex = category.subcategories.findIndex(sub => sub._id.toString() === subcategoryId);

        if (subcategoryIndex === -1) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        // Update subcategory fields
        if (name) category.subcategories[subcategoryIndex].name = name;
        if (imgUrl) category.subcategories[subcategoryIndex].imgUrl = imgUrl;

        await category.save();
        res.status(200).json({ message: 'Subcategory updated successfully', category });
    } catch (error) {
        console.error("Error updating subcategory:", error);
        res.status(500).json({ error: 'Failed to update subcategory' });
    }
};
exports.deleteSubcategory = async (req, res) => {
    const { categoryId, subcategoryId } = req.params;

    try {
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        category.subcategories = category.subcategories.filter(sub => sub._id.toString() !== subcategoryId);

        await category.save();
        res.status(200).json({ message: 'Subcategory deleted successfully', category });
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        res.status(500).json({ error: 'Failed to delete subcategory' });
    }
};
