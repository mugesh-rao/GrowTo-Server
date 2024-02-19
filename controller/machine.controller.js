const Machine = require("../models/machine.model");
const { generateUniqueMachineID } = require("../utils/IDGenerator");
const handleUpload = require("../utils/mutler");


async function getMachines(req, res) {
  try {
    const machines = await Machine.find();
    res.json(machines);
  } catch (error) {
    console.error("Error fetching machines:", error);
    res
      .status(500)
      .json({ status: "error", error: "Failed to fetch machines" });
  }
}

async function getMachinesWithPagination(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const machines = await Machine.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Machine.countDocuments();
    res.json({
      machines,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching machines with pagination:", error);
    res
      .status(500)
      .json({ status: "error", error: "Failed to fetch machines" });
  }
}
const addMachine = async (req, res) => {
  try {
    // Destructure necessary fields from the request body
    const {
      name,
      category,
      price,
      season,
      location,
      ownerName,
      description,
      discountPrice,
      ownerID,
    } = req.body;
    const GTID = await generateUniqueMachineID();

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // Upload the file to Cloudinary
    const cldRes = await handleUpload(dataURI, "Machines");
      const machine = new Machine({
      name,
      GTID,
      category,
      price,
      season,
      location,
      ownerName,
      description,
      discountPrice,
      ownerID,
      images: [{ public_id:cldRes.public_id, url: cldRes.secure_url }], 
      img:cldRes.url,
    });

    // Save the machine to the database
    await machine.save();

    // Send a success response
    res.status(200).json({ status: "success", message: "Machine added successfully" });
  } catch (error) {
    // Log and send an error response if an error occurs
    console.error("Error adding machine:", error);
    res.status(500).json({ status: "error", error: "Failed to add machine" });
  }
};




async function EditMachine(req, res) {
  const machineId = req.params.id;
  const updatedMachineData = req.body;
  try {
    const machine = await Machine.findById(machineId);

    if (!machine) {
      return res.status(404).json({ error: "Machine not found" });
    }

    // Check if the user has permission to edit the machine
    if (machine.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Permission denied" });
    }

    // Update machine data
    Object.assign(machine, updatedMachineData);
    await machine.save();
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Error updating machine:", error);
    res
      .status(500)
      .json({ status: "error", error: "Failed to update machine" });
  }
}
async function DeleteMachine(req, res) {
  const machineId = req.params.id;
  try {
    const machine = await Machine.findById(machineId);

    if (!machine) {
      return res.status(404).json({ error: "Machine not found" });
    } 

    await Machine.deleteOne({ _id: machineId });
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Error deleting machine:", error);
    res.status(500).json({ status: "error", error: "Failed to delete machine" });
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
async function getMachinesByAdminID(req, res) {
  try {
    const adminID = req.params.adminID;
    const machines = await Machine.find({ ownerID: adminID }).exec();

    res.status(200).json(machines);
  } catch (error) {
    console.error("Error fetching machines by admin ID:", error);
    res
      .status(500)
      .json({ status: "error", error: "Failed to fetch machines by admin ID" });
  }
}
module.exports = {
  getMachines,
  addMachine,
  getMachineById,
  EditMachine,
  DeleteMachine,
  getMachinesByAdminID,

};
