const Machine = require("../models/machine.model");

async function getMachines(req, res) {
  try {
    const machines = await Machine.find();
    res.json(machines);
  } catch (error) {
    console.error("Error fetching machines:", error);
    res.status(500).json({ status: "error", error: "Failed to fetch machines" });
  }
}

async function addMachine(req, res) {
  const machineData = req.body;
  try {
    const machine = new Machine(machineData);
    await machine.save();
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Error adding machine:", error);
    res.status(500).json({ status: "error", error: "Failed to add machine" });
  }
}

async function getMachineById(req, res) {
  try {
    const machineId = req.params.id; // Assuming you're using Express route params

    // Check if machineId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(machineId)) {
      return res.status(400).json({ error: "Invalid machineId" });
    }

    const machine = await Machine.findById(machineId);

    if (!machine) {
      return res.status(404).json({ error: "Machine not found" });
    }

    res.status(200).json(machine);
  } catch (error) {
    console.error("Error fetching machine:", error);
    res.status(500).json({ error: "Failed to fetch machine" });
  }
}

module.exports = {
  getMachines,
  addMachine,
  getMachineById,
};
