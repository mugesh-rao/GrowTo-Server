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
    // machine.owner = req.user.id; 
    await machine.save();
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Error adding machine:', error);
    res.status(500).json({ status: 'error', error: 'Failed to add machine' });
  }
}
async function EditMachine(req, res) {
  const machineId = req.params.id;
  const updatedMachineData = req.body;
  try {
    const machine = await Machine.findById(machineId);

    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    // Check if the user has permission to edit the machine
    if (machine.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    // Update machine data
    Object.assign(machine, updatedMachineData);
    await machine.save();
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Error updating machine:', error);
    res.status(500).json({ status: 'error', error: 'Failed to update machine' });
  }
}
async function DeleteMachine(req, res) {
  const machineId = req.params.id;
  try {
    const machine = await Machine.findById(machineId);

    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    // Check if the user has permission to delete the machine
    if (machine.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    await machine.remove();
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Error deleting machine:', error);
    res.status(500).json({ status: 'error', error: 'Failed to delete machine' });
  }
}
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

module.exports = {
  getMachines,
  addMachine,
  getMachineById,
  EditMachine,
  DeleteMachine
};
