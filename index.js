var fs = require("fs");

if (!fs.existsSync("apidocs")){
    fs.mkdirSync("apidocs");
}
exports.saveResponse = function(req, res, next) {
    var oldSend = res.send;
    res.send = function(data) {
      let content = `
        URI: ${req.url},
        Method: ${req.method},
        Description: "",
        Request-Parameters: ${
          req.method == "GET"
            ? JSON.stringify(req.query)
            : JSON.stringify(req.body)
        },
        Headers: ${JSON.stringify(req.headers) || ""},
        Response: ${arguments["0"]}
      `;
      fs.writeFileSync(
        `apidocs/${req.method}_${req.url.split("/").join("-")}.txt`,
        content
      );
      oldSend.apply(res, arguments);
    };
    next();
}