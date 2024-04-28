const urlParams = new URLSearchParams(window.location.search);
const mealId = urlParams.get("id");

async function getMealDetails() {
  if (!mealId) {
    window.location.href = "/index.html";
    return;
  }

  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealId
  );

  const data = await response.json();

  // get required elements from the HTML page
  const imgContainer = document.getElementById("image-container");
  const mealHeadingDiv = document.getElementById("meal-heading");
  const mealRecipeDiv = document.getElementById("meal-recipe");
  const knowHowDiv = document.getElementById("know-how");
  const ytLinkDiv = document.getElementById("yt-link");
  const ingredientsDiv = document.getElementById("ingredients");
  const pageTitle = document.getElementsByTagName("title")[0];

  const ingredientCount = 20;

  if (data && data.meals) {
    const meal = data.meals[0];
    pageTitle.innerHTML = meal.strMeal;
    imgContainer.style.backgroundImage = `url(${meal.strMealThumb})`;

    const mealName = document.createElement("h1");
    mealName.innerHTML = meal.strMeal;
    const mealType = document.createElement("h3");
    mealType.innerHTML = `${meal.strArea} ${meal.strCategory} Dish`;

    mealHeadingDiv.appendChild(mealName);
    mealHeadingDiv.appendChild(mealType);

    knowHowDiv.innerHTML = `Wanna Know How To ${meal.strMeal}?`;

    let ingredientString = "Ingredients: ";
    let ingredientName = "";
    let ingredientQty = "";

    // populate the ingridients list
    for (let i = 1; i <= ingredientCount; i++) {
      ingredientName = "strIngredient" + i.toString();
      ingredientQty = "strMeasure" + i.toString();

      if (meal[ingredientName] != "") {
        ingredientString += meal[ingredientName];
        if (meal[ingredientQty].trim())
          ingredientString += ` (${meal[ingredientQty].trim()})`;
        ingredientString += ", ";
      }
    }

    // remove the trailing space and comma
    ingredientString = ingredientString.slice(0, ingredientString.length - 2);
    ingredientsDiv.innerHTML = ingredientString;

    const recipe = document.createElement("ol");
    recipe.id = "receipe-list";

    // regexp used from cleaup of recipe strings
    const startsWithNumberAndDot = /^[0-9]+\./;
    const pattern = /^step \d+$/i;

    meal.strInstructions.split("\r\n").forEach((instruction) => {
      if (startsWithNumberAndDot.test(instruction)) {
        instruction = instruction.slice(3, instruction.length);
      }
      if (pattern.test(instruction.trim())) {
        instruction = "";
      }
      if (instruction != "") {
        const step = document.createElement("li");
        step.innerHTML = instruction;

        recipe.appendChild(step);
      }
    });

    mealRecipeDiv.appendChild(recipe);

    ytLinkDiv.addEventListener("click", () => {
      window.location.href = meal.strYoutube ? meal.strYoutube : "";
    });
  }
}

document.getElementById("home-btn").addEventListener("click", () => {
  window.location.href = "/";
});

// initial render
getMealDetails();
