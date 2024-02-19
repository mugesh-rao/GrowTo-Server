const Machine = require("../models/machine.model");

async function generateUniqueMachineID() {
    // Find the latest machine in the database to determine the next counter value
    const latestMachine = await Machine.findOne({}, {}, { sort: { 'createdAt' : -1 } });
    let counter = 1; // Default counter value if no machines exist yet
    let letter = 'A'; // Start with letter A
  
    // If there are existing machines, extract the counter value from the latest machine ID
    if (latestMachine && latestMachine.GTID) {
      const lastMachineID = latestMachine.GTID;
      const lastCounter = parseInt(lastMachineID.substring(4, 9)); // Extract the counter value
      counter = lastCounter + 1; // Increment the counter for the next machine
  
      // If the counter exceeds 9999, increment the letter and reset the counter to 1
      if (counter > 9999) {
        const lastLetter = lastMachineID.substring(3, 4);
        if (lastLetter === 'Z') {
          letter = 'A'; // Reset to 'A' if 'Z' is reached
        } else {
          letter = String.fromCharCode(lastLetter.charCodeAt(0) + 1); // Increment the letter
        }
        counter = 1; // Reset the counter to 1
      }
    }
  
    // Generate the machine ID based on the counter value and letter
    const machineID = `GT${letter}${String(counter).padStart(4, '0')}`;
    return machineID;
  }
module.exports={generateUniqueMachineID}