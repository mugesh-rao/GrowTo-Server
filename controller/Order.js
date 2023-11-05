async function storeData(req, res) {
    try {
      const { consumer, products, totalAmount } = req.body;
  
      // Create a new Order document
      const order = new Order({
        consumer,
        products,
        totalAmount,
      });
      await order.save();
      await order.populate("consumer", "-_id name email").execPopulate();
      await order.populate("products.product", "-_id name price").execPopulate();
  
      res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  }
  
  module.exports = {
    storeData
  };
  