

const express = require('express');
const router = express.Router();
const categoryController = require('../controller/superadmin/category');
const machineController = require('../controller/machine.controller');
const Provider = require('../controller/superadmin/Providers');
const Users = require('../controller/superadmin/User');
const Multer = require("multer");
const upload = Multer({ storage: Multer.memoryStorage() });

router.post('/createCategory', upload.single('image'), categoryController.createCategory);
router.get('/getcategories', categoryController.getCategories);
router.put('/:id', upload.single('image'), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
router.post('/categories/:categoryId/subcategories',upload.single('image'), categoryController.addSubcategory);
router.put('/:categoryId/subcategories/:subcategoryId', categoryController.updateSubcategory);
router.delete('/:categoryId/subcategories/:subcategoryId', categoryController.deleteSubcategory);
router.get("/machines", machineController.getMachines);
router.get("/getProviders",Provider.getAllProviders );
router.get("/getUsers",Users.getAllUsers );

module.exports = router;
