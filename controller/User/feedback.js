const Feedback = require("../../models/feedback.mode");

async function addFeedback(req, res) {
  const feedbackData = req.body;

  try {
    const feedback = new Feedback(feedbackData);
    await feedback.save();

    res.json({ status: "ok", feedback });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ status: "error", error: "Failed to add feedback" });
  }
}

module.exports = {
  addFeedback,
};
