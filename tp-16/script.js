const recetasContainer = document.getElementById("recetas");
const spinner = document.getElementById("spinner");

const banderas = {
  Chinese: "🇨🇳",
  Italian: "🇮🇹",
  American: "🇺🇸"
};

async function cargarRecetas(area) {
  recetasContainer.innerHTML = "";
  spinner.classList.remove("d-none");

  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    const data = await res.json();
    mostrarRecetas(data.meals, area);
  } catch (error) {
    recetasContainer.innerHTML = "<p class='text-danger text-center'>⚠️ Error al cargar recetas</p>";
  } finally {
    spinner.classList.add("d-none");
  }
}

function mostrarRecetas(recetas, area) {
  recetasContainer.innerHTML = recetas.map(r => `
    <div class="col-sm-6 col-md-4 col-lg-3">
      <div class="card h-100 shadow-sm border-0 rounded-3">
        <img src="${r.strMealThumb}" class="card-img-top rounded-top" alt="${r.strMeal}">
        <div class="card-body d-flex flex-column text-center">
          <h5 class="card-title">${banderas[area]} ${r.strMeal}</h5>
          <button class="btn btn-outline-primary mt-auto fw-bold" onclick="verDetalle(${r.idMeal})">
            📖 Ver más
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

async function verDetalle(idMeal) {
  spinner.classList.remove("d-none");
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
    const data = await res.json();
    const receta = data.meals[0];
    mostrarDetalle(receta);
  } catch (error) {
    alert("Error al cargar detalles de la receta");
  } finally {
    spinner.classList.add("d-none");
  }
}

function mostrarDetalle(receta) {
  document.getElementById("tituloReceta").textContent = receta.strMeal;
  document.getElementById("imagenReceta").src = receta.strMealThumb;
  const lista = document.getElementById("ingredientes");
  lista.innerHTML = "";
  for (let i = 1; i <= 20; i++) {
    const ingrediente = receta[`strIngredient${i}`];
    const medida = receta[`strMeasure${i}`];
    if (ingrediente && ingrediente.trim() !== "") {
      const li = document.createElement("li");
      li.textContent = `${ingrediente} - ${medida}`;
      lista.appendChild(li);
    }
  }
  const pasos = receta.strInstructions.split(". ")
    .filter(p => p.trim() !== "");
  const instruccionesLista = pasos.map(p => `<li>${p.trim()}.</li>`).join("");
  document.getElementById("instrucciones").innerHTML = `<ul>${instruccionesLista}</ul>`;

  const modal = new bootstrap.Modal(document.getElementById("modalDetalle"));
  modal.show();
}

cargarRecetas("Chinese");
