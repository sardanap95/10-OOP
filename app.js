const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let oneMngr = 0;
let employees = [];

promptUser();

async function promptUser() {
  try {
    console.log("Welcome to the Software Engineering Team Generator");
    const { name } = await inquirer.prompt({
      type: "input",
      name: "name",
      message: "Employee's name:  ",
    });

    const { id } = await inquirer.prompt({
      type: "input",
      name: "id",
      message: "Employee's ID:  ",
    });

    const { email } = await inquirer.prompt({
      type: "input",
      name: "email",
      message: "Employee's email:  ",
      default: () => {},
      validate: function (email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          String(email).toLowerCase()
        )
          ? true
          : false;
      },
    });

    const { role } = await inquirer.prompt({
      type: "list",
      name: "role",
      message: "Select which part of the team this employee is on:",
      choices: ["Engineer", "Intern", "Manager"],
    });

    const { github } = await inquirer.prompt({
      type: "input",
      name: "github",
      message: "Engineers will enter thier Github:",
      when: (answers) => role === "Engineer",
    });

    const { school } = await inquirer.prompt({
      type: "input",
      name: "school",
      message: "Please entrer your school name.",
      when: (answers) => role === "Intern",
    });

    const { officeNumber } = await inquirer.prompt({
      type: "input",
      name: "officeNumber",
      message: "Enter Manager's office number:",
      when: (answers) => role === "Manager",
    });

    switch (role) {
      case "Engineer":
        employees.push(new Engineer(name, id, email, github));
        console.log(name + " is part of the engineering team now!");
        break;
      case "Intern":
        employees.push(new Intern(name, id, email, school));
        console.log(name + " is part of intern team now!");
        break;
      case "Manager":
        if (oneMngr < 1) {
          employees.push(new Manager(name, id, email, officeNumber));
          console.log(name + " is the team manager.");
          oneMngr++;
        } else {
          console.log("There is only one manager for this project.");
        }
        break;
      default:
        console.log("Opps, wrong role");
        break;
    }

    const { addTeamMember } = await inquirer.prompt({
      type: "list",
      message: "Add another Team Member?",
      name: "addTeamMember",
      choices: ["Yes", "No"],
    });
    let addMem = addTeamMember;
    switch (addMem) {
      case "Yes":
        promptUser();
        break;
      case "No":
        if (!fs.existsSync(OUTPUT_DIR)) {
          fs.mkdirSync(OUTPUT_DIR);
        }
        fs.writeFileSync(outputPath, render(employees), "utf8");
        console.log("This HR Team will be the Summer Success for the Pushpi Corps!");
        break;
    }
  } catch (err) {
    console.log(err);
  }
}
