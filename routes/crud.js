var express = require("express");
var router = express.Router();
const connection = require("../lib/config");
const { request, render } = require("../app");

/* GET home page. */
router.get("/", function (req, res, next) {
  connection.query("SELECT * FROM music ORDER BY id desc", (err, rows) => {
    if (err) {
      res.render("crud", { data: "" });
    } else {
      res.render("crud", {
        data: rows,
        title: "Crud",
      });
      console.log(rows);
    }
  });
});

//Send Data to Display after Add && Render Page Add
router.get("/add", (req, res, next) => {
  res.render("./crud/add", {
    title: "Crud",
    name: "",
    judul: "",
    jumlah: "",
  });
});

// Proses Add
router.post("/proses-add", (req, res, next) => {
  // Get Value Input Dom Add
  let name = req.body.name;
  let judul = req.body.judul;
  let jumlah = req.body.jumlah;
  let error = false;

  // Validasi if input null
  if (name.length === 0 || judul.length === 0 || jumlah.length === 0) {
    error = true; //Todo
    console.log("errors");

    //Back to Page add
    res.render("./crud/add", {
      title: "Crud",
      name,
      judul,
      jumlah,
    });
  }

  if (!error) {
    let formData = {
      name,
      judul,
      jumlah,
    };
    connection.query("INSERT INTO music set ?", formData, (err, result) => {
      if (err) {
        console.log(err);
        res.render("./crud/add", {
          title: "Crud",
          name: formData.name,
          judul: formData.judul,
          jumlah: formData.jumlah,
        });
      } else {
        console.log("Add Data Sukses");
        res.redirect("/");
      }
    });
  }
});

// Delete & Proses Delet
router.get("/delete/(:id)", (req, res, render) => {
  let id = req.params.id;
  connection.query("DELETE FROM music WHERE id =" + id, (err, result) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      console.log("delete sukses" + id);
      res.redirect("/");
    }
  });
});

// Update

router.get("/edit/(:id)", (req, res, next) => {
  let id = req.params.id;

  connection.query("SELECT * FROM music WHERE id =" + id, (err, rows, fields) => {
    if (err) throw err;

    // if data not
    if (rows.length > 0) {
      res.render("crud/edit", {
        title: "Edit crud",
        id: rows[0].id,
        name: rows[0].name,
        judul: rows[0].judul,
        jumlah: rows[0].jumlah,
      });
    } else {
      console.log("error", "music not found with id =" + id);
      res.redirect("/");
    }
  });
});

router.post("/proses-edit/:id", (req, res, next) => {
  let id = req.params.id;
  let name = req.body.name;
  let judul = req.body.judul;
  let jumlah = req.body.jumlah;
  let errors = false;

  if (name.length === 0 || judul.length === 0 || jumlah.length === 0) {
    errors = true;
    // Message Error
    console.log("error", "Please enter name and judul & jumlah");
    // render
    res.render("/edit", {
      id,
      name,
      judul,
      jumlah,
    });
  }

  if (!errors) {
    let dataForm = {
      id,
      name,
      judul,
      jumlah,
    };
    connection.query("UPDATE music set? WHERE id =" + id, dataForm, (err, result) => {
      if (!err) {
        console.log("success", "Book Successfully Added");
        res.redirect("/");
      } else {
        console.log(err);
        // Back to
        res.render("/update", {
          id: req.params.id,
          name: dataForm.name,
          judul: dataForm.judul,
          jumlah: dataForm.jumlah,
        });
      }
    });
  } else {
    console.log("success", "Book Successfully Added");
    res.redirect("/books");
  }
});

module.exports = router;
