const { notDeepEqual } = require("assert");
const express = require("express");
const { json } = require("express/lib/response");
const app = express();

const fs = require("fs");
const { format } = require("path");

app.set("view engine", "pug");

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: false }));

// localhost:5000
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/create", (req, res) => {
  res.render("create");
});

//Create method function
app.post("/create", (req, res) => {
  const FullName = req.body.FullName;
  const Email = req.body.Email;
  const PhoneNumber = req.body.PhoneNumber;
  const Address = req.body.Address;
  const Dormitory = req.body.Dormitory;

  if (
    FullName.trim() === "" &&
    Email.trim() === "" &&
    PhoneNumber.trim() === "" &&
    Address.trim() === "" &&
    Dormitory.trim() ===""
  ) {
    res.render("create", { error: true });
  } else if (isNaN(PhoneNumber)) {
    res.render("create", { phoneError: true });
  } else if (!Email.includes("@")) {
    res.render("create", { emailError: true });
  } else {
    fs.readFile("./data/applicants.json", (err, data) => {
      if (err) throw err;

      const applicants = JSON.parse(data);
      applicants.push({
        id: id(),
        FullName: FullName,
        Email: Email,
        PhoneNumber: PhoneNumber,
        Address: Address,
        Dormitory: Dormitory,
      });

      fs.writeFile("./data/applicants.json", JSON.stringify(applicants), (err) => {
        if (err) throw err;

        res.render("create", { success: true });
      });
    });
  }
});

// Get method function
app.get("/api/v1/applicants", (req, res) => {
  fs.readFile("./data/applicants.json", (err, data) => {
    if (err) throw err;

    const applicants = JSON.parse(data);

    res.json(applicants);
  });
});
//
app.get("/applicants", (req, res) => {
  fs.readFile("./data/applicants.json", (err, data) => {
    if (err) throw err;

    const applicants = JSON.parse(data);

    res.render("applicants", { applicants: applicants });
  });
});
//

app.get("/applicants/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/applicants.json", (err, data) => {
    if (err) throw err;

    const applicants = JSON.parse(data);

    const application = applicants.find((application) => application.id == id);

    res.render("detail", {
      FullName: application.FullName,
      Email: application.Email,
      PhoneNumber: application.PhoneNumber,
      Address: application.Address,
      Dormitory: application.Dormitory,
    });
  });
});
//

//Delete method function
app.post("/applicants/delete/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/applicants.json", (err, data) => {
    if (err) throw err;

    const applicants = JSON.parse(data);

    const newapplicants = applicants.filter((application) => application.id !== id);

    res.redirect("/applicants");

    fs.writeFile("./data/applicants.json", JSON.stringify(newapplicants), (err) => {
      if (err) throw err;

      res.render("create", { success: true });
    });
  });
});
// Edit(Update) method function
app.post("/applicants/edit/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/applicants.json", (err, data) => {
    if (err) throw err;

    const applicants = JSON.parse(data);

    const applicationToUpdate = applicants.find((application) => application.id === id);

    console.log(applicationToUpdate);

    res.render("update", { application: applicationToUpdate });
  });
});

app.post("/applicants/update/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/applicants.json", (err, data) => {
    if (err) throw err;

    const applicants = JSON.parse(data);

    const applicationToUpdate = applicants.find((application) => application.id === id);

    applicationToUpdate.FullName = req.body.FullName;

    applicationToUpdate.Email = req.body.Email;
    applicationToUpdate.PhoneNumber = req.body.PhoneNumber;
    applicationToUpdate.Address = req.body.Address;
    applicationToUpdate.Dormitory = req.body.Dormitory;

    fs.writeFile("./data/applicants.json", JSON.stringify(applicants), (err) => {
      if (err) throw err;

      res.redirect("/applicants");
    });
  });
});

app.listen(5000, (err) => {
  if (err) console.log(err);

  console.log("server is running on port 5000...");
});

function id() {
  return "_" + Math.random().toString(24).substr(3, 8);
}
