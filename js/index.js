import { HOME_URL } from "./utils.js";

async function mealsSearch(food) {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + food
  );

  const data = await response.json();

  let favMeals = fetchFavMeals();

  const mealsDiv = document.getElementsByClassName("meals")[0];
  mealsDiv.innerHTML = "";
  if (data && data.meals) {
    data.meals.forEach((meal) => {
      const mealDiv = document.createElement("div");
      mealDiv.classList.add("meal");
      const mealImg = document.createElement("img");
      mealImg.src = meal.strMealThumb;

      const mealDetails = document.createElement("div");
      mealDetails.classList.add("meal-details");

      const mealTitle = document.createElement("h2");
      mealTitle.classList.add("meal-title");
      mealTitle.innerHTML = meal.strMeal;

      const likeButton = document.createElement("i");
      likeButton.classList.add("fa-heart", "fa-regular");

      if (favMeals.find((id) => meal.idMeal == id)) {
        likeButton.classList.add("fa-solid");
      } else {
        likeButton.classList.add("fa-regular");
      }

      likeButton.addEventListener("click", () => {
        addToFavourites(meal.idMeal);
        favMeals = fetchFavMeals();
        if (favMeals.find((id) => meal.idMeal == id)) {
          likeButton.classList.add("fa-solid");
        } else {
          likeButton.classList.add("fa-regular");
        }
      });

      mealTitle.appendChild(likeButton);

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

      mealDetails.appendChild(mealTitle);
      mealDetails.appendChild(mealArea);
      mealDetails.appendChild(mealReceipe);

      mealDiv.appendChild(mealImg);
      mealDiv.appendChild(mealDetails);

      mealsDiv.appendChild(mealDiv);
    });
  } else {
    const noMeals = document.createElement("h2");
    noMeals.innerHTML = "No meals found";
    mealsDiv.appendChild(noMeals);
  }
}

// debouncer to make delayed API calls
function debouncer(func, delay) {
  let timer;
  return function (term) {
    let context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// calling mealsSearch func with 500ms delay
const delayedGetData = debouncer(mealsSearch, 500);

// calling delayedGetData on each input in search bar
document.getElementById("meals-search").addEventListener("input", (e) => {
  delayedGetData(e.target.value);
});

// function to fetch favourite meals from local storage
function fetchFavMeals() {
  let favMeals = localStorage.getItem("favoriteMeals");
  if (favMeals) {
    favMeals = JSON.parse(favMeals);
  } else {
    favMeals = [];
  }

  return favMeals;
}

// function to add a meal to favourites in local storage
function addToFavourites(mealId) {
  let favMeals = fetchFavMeals();
  if (
    !favMeals.find((id) => {
      return id == mealId;
    })
  ) {
    favMeals.push(mealId);
  }
  localStorage.setItem("favoriteMeals", JSON.stringify(favMeals));
}

document.getElementById("favs-btn").addEventListener("click", () => {
  window.location.href = HOME_URL + "/pages/favorites.html";
});

// initial render
mealsSearch("");
