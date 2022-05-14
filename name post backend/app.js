const http = require("http");

let nombres = [];

http
  .createServer((req, res) => {
    const URL = req.url;
    const METHOD = req.method;

    let code = 200;
    let data = { msg: "got it" };

    if (URL === "/test") {
      switch (METHOD) {
        case "GET":
          data = { ...data, nombres };
          break;
        case "POST":
          let body = [];
          req
            .on("data", (chunk) => {
              body.push(chunk);
            })
            .on("end", () => {
              body = Buffer.concat(body).toString();
              data = JSON.parse(body);
              const nombre = { ...data, id: (Date.now() + "").slice(-10) };
              nombres.push(nombre);
            });

          data = { ...data, msg: "posted" };
          break;
        case "DELETE":
          //TODO
          break;
        default:
          code = 404;
          data = { ...data, msg: "No hay accion con la ruta actual" };
          break;
      }
    } else {
      code = 404;
      data = { ...data, msg: "No se encuentra la ruta deseada" };
    }

    res.writeHead(code, {
      "Content-Type": "application/json; charset=utf-8",
    });
    res.write(JSON.stringify(data));
    res.end();
  })
  .listen(3000);
