const db = require("../models");

const { v4: uuidv4 } = require("uuid");

const Nationality = db.nationality;

exports.insertAllNationalities = (req, res) => {
  const nationalities = req.body.nationalities;
  nationalities.forEach((object) => {
    db.nationality.insertMany(
      {
        _id: uuidv4(),
        name: object.name,
      },
      function (err, response) {
        if (err) {
          res.status(500).send({ message: "We have error" });
          return;
        } else {
          console.log("Add Success");
        }
      }
    );
  });

  res.status(200).send({
    message: "All nationalities were registered successfully!",
  });
  return;
};

exports.getAllNationalities = (req, res) => {
  Nationality.find(function (error, nationalities) {
    if (error) {
      return res.status(500).send({ message: "We have error" });
    } else {
      return res.status(200).send({
        nationalities,
      });
    }
  });
};
