let Clarifai = require("clarifai");
let Account = require("./account.json");
let Categories = require("./categories.json");
let app = new Clarifai.App(`${Account.clientId}`, `${Account.clientSecret}`);

// predict the contents of an image by passing in a path (url)

let categoryfilter = name => {
  for (let category in Categories) {
    return Categories[category].includes(name);
  }
};

module.exports.getPrediction = url => {
  return new Promise((resolve, reject) => {
    //resolve
    app.models
      .predict(Clarifai.FOOD_MODEL, url)
      .then(response => {
        let concepts = response.outputs[0].data.concepts;
        let rawPredicts = concepts
          .map(item => obj = { name: item.name, value: item.value })
          .filter(item => categoryfilter(item.name));

        resolve(rawPredicts);
        //reject
      })
      .catch(err => reject(err));
  });
};