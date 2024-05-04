import { HOME_URL } from "./utils.js";

let fav = fetchFavMeals();

function fetchFavMeals() {
  let favMeals = localStorage.getItem("favoriteMeals");
  if (favMeals) {
    favMeals = JSON.parse(favMeals);
  } else {
    favMeals = [];
  }

  return favMeals;
}

const mealsDiv = document.getElementsByClassName("meals")[0];

function populateFavMeals() {
  mealsDiv.innerHTML = "";
  if (fav.length)
    fav.forEach(async (favMeal) => {
      const resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + favMeal
      );
      const data = await resp.json();
      const meal = data.meals && data.meals[0];

      if (meal) {
        const mealDiv = document.createElement("div");
        mealDiv.classList.add("meal");
        const mealImg = document.createElement("img");
        mealImg.src = meal.strMealThumb;

        const mealDetails = document.createElement("div");
        mealDetails.classList.add("meal-details");

        const mealTitle = document.createElement("h2");
        mealTitle.classList.add("meal-title");
        mealTitle.innerHTML = meal.strMeal;

        const mealArea = document.createElement("b");
        mealArea.classList.add("meal-area");
        mealArea.innerHTML = meal.strArea;

        const mealReceipe = document.createElement("p");
        mealReceipe.classList.add("meal-recipe");
        mealReceipe.innerHTML = meal.strInstructions.slice(0, 100) + "... ";

        const viewMore = document.createElement("span");
        viewMore.innerHTML = "Click to view more";

        mealReceipe.appendChild(viewMore);

        viewMore.addEventListener("click", () => {
          window.location.href =
            HOME_URL + "/pages/meal-details.html?id=" + meal.idMeal;
        });

        const removeFromFavBtn = document.createElement("button");
        removeFromFavBtn.classList.add("remove-meal");
        removeFromFavBtn.textContent = "Remove";
        removeFromFavBtn.addEventListener("click", () => {
          removeMealFromFav(meal.idMeal);
        });

        mealDetails.appendChild(mealTitle);
        mealDetails.appendChild(mealArea);
        mealDetails.appendChild(mealReceipe);
        mealDetails.appendChild(removeFromFavBtn);

        mealDiv.appendChild(mealImg);
        mealDiv.appendChild(mealDetails);

        mealsDiv.appendChild(mealDiv);
      }
    });
  else {
    const noMeals = document.createElement("h2");
    noMeals.innerHTML = "No meals found";
    mealsDiv.appendChild(noMeals);
  }
}

document.getElementById("home-btn").addEventListener("click", () => {
  window.location.href = HOME_URL + "/";
});

function removeMealFromFav(mealId) {
  fav = fav.filter((meal) => {
    return meal != mealId;
  });

  localStorage.setItem("favoriteMeals", JSON.stringify(fav));
  populateFavMeals();
}

populateFavMeals();
