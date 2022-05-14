const URL = "http://localhost:3000";
const form = document.querySelector("form");
const inputNombre = document.getElementById("nombre-input");
const tbody = document.querySelector("tbody");

class App {
  constructor() {
    this.getNombres();
    form.addEventListener("submit", this.submitNombre.bind(this));
  }

  getNombres() {
    fetch(`${URL}/test`)
      .then((res) => res.json())
      .then((res) => {
        this.pintarNombres(res);
        this.agregarListeners();
      })
      .catch((err) => console.log(err));
  }

  submitNombre(e) {
    e.preventDefault();

    this.postNombre(inputNombre.value);
  }

  pintarNombres({ nombres }) {
    let html = "";
    nombres.forEach(({ id, nombre }) => {
      html += `
        <tr id="${id}">
          <td>${nombre}</td>
          <td><button class="eliminar-btn">Eliminar</button></td>
        </tr>
      `;
    });

    tbody.insertAdjacentHTML("afterbegin", html);
  }

  agregarListeners() {
    const eliminarButtons = document.querySelectorAll(".eliminar-btn");

    eliminarButtons.forEach((button) =>
      button.addEventListener("click", this.quitarNombre.bind(this))
    );
  }

  postNombre(nombre) {
    if (nombre.trim().length <= 0) return;

    const options = {
      method: "POST",
      body: JSON.stringify({ nombre }),
      headers: new Headers({ "Content-Type": "application/json" }),
    };

    fetch(`${URL}/test`, options)
      .then((res) => {
        if (res.status > 299) throw new Error("Un error");
        return res.json();
      })
      .then((res) => {
        this.agregarNuevoNombre(res);
      })
      .catch((err) => alert(err));
  }

  agregarNuevoNombre({ id, nombre }) {
    let html = `
      <tr id="${id}">
        <td>${nombre}</td>
        <td><button class="eliminar-btn">Eliminar</button></td>
      </tr>
    `;

    tbody.insertAdjacentHTML("beforeend", html);

    const btn = document.getElementById(id).querySelector("button");
    btn.addEventListener("click", this.quitarNombre.bind(this));

    inputNombre.value = "";
  }

  quitarNombre(e) {
    const tr = e.target.closest("tr");
    const options = {
      method: "DELETE",
    };

    fetch(`${URL}/test/${tr.id}`, options)
      .then((res) => {
        if (res.status > 299) throw new Error("Otro error");
        tbody.removeChild(tr);
      })
      .catch((err) => alert(err));
  }
}

const app = new App();
