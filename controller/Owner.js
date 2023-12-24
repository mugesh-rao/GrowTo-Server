const Machine = require("../models/machine.model");

async function getMachineById(req, res) {
  try {
    const machineId = req.params.id;
    console.log(machineId);
    // Check if machineId is a valid ObjectId
    // if (!mongoose.Types.ObjectId.isValid(machineId)) {
    //   return res.status(400).json({ error: "Invalid machineId" });
    // }
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