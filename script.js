//declaring a const variable and assign the element by this Id
const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEl = document.getElementById('single-meal');


// search meal and fetch API
function searchMeal(e){
    e.preventDefault();

    // clear single meal
    single_mealEl.innerHTML = '';

    // Get the search term
    const term = search.value;

    // check for empty
    if(term.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        //This line display the images when the user type the name of the meal
        .then(res => res.json())
        //This line display the a text message of the user meal input
        .then(data => {

            console.log(data);
            resultHeading.innerHTML = `<h2> Search results for '${term}':</h2>`;
             //if condition to display a message when the user type a meal that not display results
            if(data.meals === null){
                resultHeading.innerHTML = `<p>There are no search results. Try again</p>`;
            //this statement will display the results of the search 
            }else{
                mealsEl.innerHTML = data.meals.map(meal => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                `)
                .join('');
            }
        });
        // clear search text
        search.value = '';
        //this statement will display a message in a pop up window when the user try to find something without 
        //a searching key word
    }else{
        alert('Please enter a search term');
    }
}

    // Fetch meal by ID
    //This function will display the content ogf the meal 
    function getMealById(mealID){
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];

            addMealToDOM(meal);
        });
    }

    // Fetch random meal from api
    function getRandomMeal(){
        // clear meals and heading
        mealsEl.innerHTML = '';
        resultHeading.innerHTML = '';
         
        // this code will take y=teh information of the meal and display it
        fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data =>{
            const meal = data.meals[0];

            addMealToDOM(meal);
        })
    }

    // Add meal to DOM
    function addMealToDOM(meal){
        const ingredients = [];

        for(let i =1; i <= 20; i++){
            if(meal[`strIngredient${i}`]){
                ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
            } else{
                break;
            }
        }

        single_mealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>
        `;
    }
    // Event listeners to that will be invoked when the event is dispatched.
    submit.addEventListener('submit', searchMeal);
    random.addEventListener('click', getRandomMeal);

    //This function will display the meal info 
    meals.addEventListener('click', e => {
        const mealInfo = e.path.find(item =>{
            if(item.classList){
                return item.classList.contains('meal-info');
            }else{
                return false;
            }
        });

        if(mealInfo){
            const mealID = mealInfo.getAttribute('data-mealid');
            getMealById(mealID);
        }
    });

