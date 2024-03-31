
const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
  name: { type: String, },
  imgUrl: { type: String,}
});

const CategorySchema = new mongoose.Schema({
  name: { type: String,  },
  imgUrl: { type: String,  },
  subcategories: [SubcategorySchema]
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
