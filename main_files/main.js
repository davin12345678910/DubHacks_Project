//Team members: Davin Win Kyi, Aditya
'use strict';

(function() {
  window.addEventListener('load', init);

  // this is where we will be inializing the behavior of the website
  function init() {
    // here we will want to initalize addEventListeners
    let startingLearning = document.getElementById('learn-button');
    let startingTeaching = document.getElementById('teach-button');

    startingLearning.addEventListener('click', startingLearnFunction);
    startingTeaching.addEventListener('click', startingTeachFunction);
  }

  function startingLearnFunction() {
    console.log("I went into here!");
    let startingPage = document.getElementById('sp');
    startingPage.classList.add('hidden');

    let studentPage = document.getElementById('student-profile');
    studentPage.classList.remove('hidden');
  }

  function startingTeachFunction() {
    console.log("I went into here!");
    let startingPage = document.getElementById('sp');
    startingPage.classList.add('hidden');

    let teacherPage = document.getElementById('teacher-profile');
    teacherPage.classList.remove('hidden');
  }

  // this will be a function we will use to get components from the html file
  function id(id) {
    return document.getElementById(id);
  }
})();
