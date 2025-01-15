// index.js


//GLOBAL VARIABLES

const ramenMenu = document.querySelector("#ramen-menu");
const ramenName = document.querySelector("#ramen-detail .name")
const detailImg = document.querySelector("#ramen-detail .detail-image")
const ramenRest = document.querySelector("#ramen-detail .restaurant")
const ramenRating = document.querySelector("#rating-display")
const ramenComment = document.querySelector("#comment-display")
const ramenForm = document.querySelector("#new-ramen")
//const ramenDetail = document.querySelector("#ramen-detail")
const editRamenForm = document.querySelector("#edit-ramen")
const editRatingInput = document.querySelector("#edit-rating")
const editCommentInput = document.querySelector("#edit-comment")
let currentRamenId = null;






//HELPER FUNCTIONS

//!global function to fetch data from the json and return as an object
const fetchData = async (url) => {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    alert(error)
  }
}



//DELIVERABLES

//! EXECUTES DELIVERABLE 1: displays Ramen imgs, and parses selection data into const for handleClick function
const displayRamens = () => {
  fetchData("http://localhost:3000/ramens")
    .then(ramens => ramens.forEach(ramen => {
      const ramenImg = document.createElement("img")
      ramenImg.className = "ramen-image"
      ramenImg.src = ramen.image;
      ramenImg.alt = ramen.name;
      ramenImg.id = ramen.id

      ramenMenu.append(ramenImg)

//!Advanced Deliverable: displays the first ramen after all html content is parsed in DOM
      if (ramens.length > 0) {
        handleClick(ramens[0]);
      }
    }));


  //!uses each selected ramen's id to be displayed in #ramen-menu with handleClick function 
  ramenMenu.addEventListener("click", (e) => {
    if (e.target.className === "ramen-image") {
      const selectedRamenId = e.target.id;

      fetchData(`http://localhost:3000/ramens/${selectedRamenId}`)
        .then(ramen => {
          handleClick(ramen);
        });
    }
  });
}






//! EXECUTES DELIVERABLE 2: displaying selected ramen details to #ramen-detail
const handleClick = (ramen) => {
  //!updates the elements within #ramen-details one by one using the id of the selected ramen, fetched in displayRamens()
  ramenName.textContent = ramen.name;
  detailImg.src = ramen.image;
  detailImg.alt = ramen.name;
  ramenRest.textContent = ramen.restaurant;
  ramenRating.textContent = ramen.rating;
  ramenComment.textContent = ramen.comment

  currentRamenId = ramen.id; //!for editRamenForm, needs ID to fetch/patch the added comment
}


//! EXECUTES DELIVERABLE 3: displaying selected ramen details (with handleClick function)
const addSubmitListener = (e) => {
  //!Prevents default refresh
  e.preventDefault()

  //!gets and names the form inputs
  const name = e.target.elements.name.value.trim()
  const image = e.target.elements.image.value.trim()
  const restaurant = e.target.elements.restaurant.value.trim()
  const rating = e.target.elements.rating.value
  const comment = e.target.elements.comment?.value.trim()
  //debugger

  //!validates the inputs
  if (name && image && restaurant && rating && comment) {
    const newRamen = { name, image, restaurant, rating, comment }

    //!adds validated data to the DOM and displays the new ramen in #ramen-menu
    const ramenImg = document.createElement("img");
    ramenImg.src = newRamen.image;
    ramenImg.alt = newRamen.name;
    ramenMenu.append(ramenImg);

    //!Advanced Deliverable: Sends POST request to the sever to make the created ramens persist
    fetch("http://localhost:3000/ramens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRamen)
    });
  }
  else {
    alert("You must include all ramen details")
  }
}
ramenForm.addEventListener("submit", addSubmitListener);

//!Advanced Deliverable: edit the submitted comment or rating
editRamenForm.addEventListener("submit", (e) => {
  //!Prevents default refresh
  e.preventDefault();

  //!gets and names the form inputs
  const updatedRating = editRatingInput.value;
  const updatedComment = editCommentInput.value.trim();

  //!validates the inputs
  if (updatedRating && updatedComment) {

    //!updates validated data to the DOM
    ramenRating.textContent = updatedRating;
    ramenComment.textContent = updatedComment;

    //!Advanced Deliverable: persisting the updated comment or rating
    if (currentRamenId) {
      fetch(`http://localhost:3000/ramens/${currentRamenId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: updatedRating,
          comment: updatedComment,
        }),
      }).catch((error) => alert("Failed to update the ramen details on the server"));
    }
  } else {
    alert("You must include new rating and comment");
  }
  //!Clears the editing form
  editRatingInput.value = "";
  editCommentInput.value = "";
});



//!Invokes functions after the DOM content has loaded
const main = () => {
  document.addEventListener("DOMContentLoaded", () => {
    displayRamens()
  })
}

main()

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};
