

  let selectedQuestions = 5;
let selectedDifficulty = "easy";

function setQuestions(num){

selectedQuestions = num;

document.getElementById("num").value = num;

document.querySelectorAll(".mcq-buttons button").forEach(btn=>btn.classList.remove("active"));

event.target.classList.add("active");
}
document.addEventListener('DOMContentLoaded',function(){
  let input=document.getElementById('num')
  input.addEventListener('input',function (){
    const value=this.value
    console.log(value);
    if(value>0 && value<50)
    {
      selectedQuestions=value
          document.querySelectorAll(".mcq-buttons button")
          .forEach(btn=>btn.classList.remove("active"));

    }
    
  });

});
function setDifficulty(format){
selectedDifficulty=format
document.querySelectorAll(".difficulty-buttons button")
          .forEach(btn=>btn.classList.remove("active"));
  event.target.classList.add('active')
}

