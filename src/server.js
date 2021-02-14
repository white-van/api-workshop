// BASE SETUP
// =============================================================================
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

import * as Controller from "./controller";

// CONFIGURATION
dotenv.config();

const app = express();
const port = process.env.PORT; // set our port
const router = express.Router();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGOOSE_PORT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
//API STARTS HERE

// Rovers
router.get("/rovers", function (req, res) {
  // no params
  Controller.getAllRovers().then(({ rovers }) => {
    // Unnecessary information
    const roverObjs = rovers.map(rover => rover.toObject());

    res.json({ rovers: roverObjs });
  });
});

router.get("/rovers/:roverId", function (req, res) {
  //param validation
  const { roverId } = req.params;
  if (!roverId || !isValidId(roverId)) {
    res.sendStatus(400);
    return;
  }

  Controller.findSingleRover(roverId).then(({ type, rover }) => {
    if (type === Controller.ResponseTypes.Success) {
      res.json({ rover: rover.toObject() });
    } else {
      res.sendStatus(404);
    }
  });
});

router.get("/rovers/:roverId/planets", function (req, res) {
  // params <- special api
  const { roverId } = req.params;
  if (!roverId || !isValidId(roverId)) {
    res.sendStatus(400);
    return;
  }
  Controller.findPlanets(roverId).then(({ type, planets }) => {
    if (type === Controller.ResponseTypes.Success) {
      res.json({ planets });
    } else {
      res.sendStatus(404);
    }
  });
});

router.post("/rover", function (req, res) {
  //post body
  Controller.createRover(req.body).then(({ rover }) => {
    res.json({ rover: rover.toObject() });
  });
});

router.patch("/rover", function (req, res) {
  //patch body
  Controller.updateRover(req.body).then(({ type }) => {
    if (type === Controller.ResponseTypes.Success) {
      res.sendStatus(200);
    }else if (type === Controller.ResponseTypes.NotFound) {
      res.sendStatus(404);
    } else {
      res.sendStatus(500);
    }
  })
});

router.delete("/rover", function (req, res) {
  // query
  const { roverId } = req.query;

  if (!roverId || !isValidId(roverId)) {
    res.sendStatus(400);
    return;
  }

  Controller.deleteRover(roverId).then(({ type }) => {
    if (type === Controller.ResponseTypes.Success) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });
});

// Moons
router.get("/moons", function (req, res) {
  // no params
  Controller.getAllMoons().then(({ moons }) => {
    const moonObjs = moons.map(moon => moon.toObject());
    res.json({ moons: moonObjs });
  });
});

router.get("/moon/:moonId", function (req, res) {
  //param
  const { moonId } = req.params;
  if (!moonId || !isValidId(moonId)) {
    res.sendStatus(400);
    return;
  }

  Controller.findSingleMoon(moonId).then(({ type, moon }) => {
    if (type === Controller.ResponseTypes.Success) {
      res.json({ moon: moon.toObject() });
    } else {
      res.sendStatus(404);
    }
  });
});

router.post("/moon", function (req, res) {
  //post body
  Controller.createMoon(req.body).then(({ moon }) => {
    res.json({ moon: moon.toObject() });
  });
});

router.patch("/moon", function (req, res) {
  //patch body
  Controller.updateMoon(req.body).then(({ type }) => {
    if (type === Controller.ResponseTypes.Success) {
      res.sendStatus(200);
    }else if (type === Controller.ResponseTypes.NotFound) {
      res.sendStatus(404);
    } else if (type === Controller.ResponseTypes.UnChanged) {
      res.sendStatus(304);
    } else {
      res.sendStatus(500);
    }
  })
});

router.delete("/moon", function (req, res) {
  // query
  const { moonId } = req.query;

  if (!moonId || !isValidId(moonId)) {
    res.sendStatus(400);
    return;
  }

  Controller.deleteMoon(moonId).then(({ type }) => {
    if (type === Controller.ResponseTypes.Success) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });
});

// Moons
app.use("/api", router);

app.listen(port);
console.log(`listening on port: ${port}`);
