import { Rover, Moon } from "./schema";

const ResponseTypes = {
  Success: "SUCCESS",
  NotFound: "NOT_FOUND",
  UnChanged: "UNCHANGED",
};

const getAllRovers = () =>
  Rover.find().then((rovers) => ({ type: ResponseTypes.Success, rovers }));

const findSingleRover = (roverId) =>
  Rover.findOne({ _id: roverId }).then((rover) => {
    if (rover) {
      return { type: ResponseTypes.Success, rover };
    }
    return { type: ResponseTypes.NotFound };
  });

const createRover = (roverData) =>
  new Rover(roverData).save().then((rover) => {
    return { type: ResponseTypes.Success, rover };
  });

const deleteRover = (roverId) =>
  Rover.deleteOne({ _id: roverId }).then((response) => {
    if (response.deletedCount === 0) {
      return { type: ResponseTypes.NotFound };
    }
    return { type: ResponseTypes.Success };
  });

const updateRover = ({ _id, name, description, MoonsVisited, dateCreated }) => {
  
  return Rover.findOne({ _id }).then(rover => {
    if (rover === null){
      return { type: ResponseTypes.NotFound };
    }
    if (name){
      rover.name = name;
    }
    if (description) {
      rover.description = description;
    }
    if (MoonsVisited){
      rover.MoonsVisited = [...rover.MoonsVisited, ...MoonsVisited];
    }
    if (dateCreated) {
      rover.dateCreated = dateCreated;
    }
    return rover.save().then(response => {
      return { type: ResponseTypes.Success };
    })
  });
};

const getAllMoons = () =>
  Moon.find().then((moons) => ({ type: ResponseTypes.Success, moons }));

const findSingleMoon = (moonId) =>
  Moon.findOne({ _id: moonId }).then((moon) => {
    if (moon) {
      return { type: ResponseTypes.Success, moon };
    }
    return { type: ResponseTypes.NotFound };
  });

const createMoon = (moonData) =>
  new Moon(moonData).save().then((moon) => {
    return { type: ResponseTypes.Success, moon };
  });

const updateMoon = ({ _id, planet, sizeOfMoon, name }) => {
  const query = [];
  if (planet) {
    query.push({ $set: { planet } });
  }

  if (sizeOfMoon) {
    query.push({ $set: { sizeOfMoon } });
  }

  if (name) {
    query.push({ $set: { name } });
  }

  return Moon.updateOne({ _id }, query).then((response) => {
    console.log(response);
    if (response.ok && response.nModified) {
      return { type: ResponseTypes.Success };
    } else if (response.ok) {
      return { type: ResponseTypes.UnChanged };
    }
    return { type: ResponseTypes.NotFound };
  });
};

const deleteMoon = (moonId) =>
  Moon.deleteOne({ _id: moonId }).then((response) => {
    if (response.deletedCount === 0) {
      return { type: ResponseTypes.NotFound };
    }
    return { type: ResponseTypes.Success };
  });

const findPlanets = (roverId) =>
  Rover.findOne({ _id: roverId }).then((rover) => {
    if (rover) {
      const moons = rover.MoonsVisited;
      const moonPromises = moons.map((moon) => Moon.findOne({ _id: moon._id }));

      return Promise.allSettled(moonPromises).then((moonResponses) => {
        const planets = {};
        moonResponses.forEach((moonResponse) => {
          if (moonResponse.status == "fulfilled") {
            planets[moonResponse.value.planet] = 1;
          }
        });

        const planetsList = Object.keys(planets);
        return { type: ResponseTypes.Success, planets: planetsList };
      });
    }
    return { type: ResponseTypes.NotFound };
  });

export {
  ResponseTypes,
  getAllMoons,
  getAllRovers,
  findSingleRover,
  findSingleMoon,
  deleteRover,
  createRover,
  updateMoon,
  deleteMoon,
  createMoon,
  findPlanets,
  updateRover
};
