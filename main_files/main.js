//Team members: Davin Win Kyi, Aditya
'use strict';

(function() {
  window.addEventListener('load', init);

  // this is where we will be inializing the behavior of the website
  function init() {
    // here we will want to initalize addEventListeners
    let startingLearning = document.getElementById('learn-button');
    let startingTeaching = document.getElementById('teach-button');

    //these eventListeners are for when a user wants to
    //start asking a question or if a teacher wants to start finding people
    //that they want to find
    startingLearning.addEventListener('click', startingLearnFunction);
    startingTeaching.addEventListener('click', startingTeachFunction);

    let studentMatchButton = document.getElementById('student-submit-button');
    let teacherMatchButton = document.getElementById('teacher-submit-button');

    studentMatchButton.addEventListener('click', studentMatchesFunction);
    teacherMatchButton.addEventListener('click', teacherMatchesFunction);

    let studentBackToQuestion = document.getElementById('back-to-student-question');
    let teacherBackToProfile = document.getElementById('back-to-teacher-profile');
    studentBackToQuestion.addEventListener('click', studentBackQuestionFunction);
    teacherBackToProfile.addEventListener('click', teacherBackProfileFunction);

    let backToChooseStudentButton = document.getElementById('back-to-choose-student');
    let backToChooseTeacherButton = document.getElementById('back-to-choose-teacher');

    backToChooseStudentButton.addEventListener('click', backToChooseStudent);
    backToChooseTeacherButton.addEventListener('click', backToChooseTeacher);
  }

  function startingLearnFunction() {
    //console.log("I went into here!");
    let startingPage = document.getElementById('sp');
    startingPage.classList.add('hidden');

    let studentPage = document.getElementById('student-profile');
    studentPage.classList.remove('hidden');
  }

  function startingTeachFunction() {
    //console.log("I went into here!");
    let startingPage = document.getElementById('sp');
    startingPage.classList.add('hidden');

    let teacherPage = document.getElementById('teacher-profile');
    teacherPage.classList.remove('hidden');
  }

  function studentMatchesFunction() {
    let studentPage = document.getElementById('student-profile');
    studentPage.classList.add('hidden');

    let studentMatches = document.getElementById('student-matches');
    studentMatches.classList.remove('hidden');
  }

  function teacherMatchesFunction() {
    let studentPage = document.getElementById('teacher-profile');
    studentPage.classList.add('hidden');

    let studentMatches = document.getElementById('teacher-matches');
    studentMatches.classList.remove('hidden');
  }

  function studentBackQuestionFunction() {
    let studentPage = document.getElementById('student-profile');
    studentPage.classList.remove('hidden');

    let studentMatches = document.getElementById('student-matches');
    studentMatches.classList.add('hidden');
  }

  function teacherBackProfileFunction() {
    let studentPage = document.getElementById('teacher-profile');
    studentPage.classList.remove('hidden');

    let studentMatches = document.getElementById('teacher-matches');
    studentMatches.classList.add('hidden');
  }

  function backToChooseStudent() {
    let studentPage = document.getElementById('student-profile');
    studentPage.classList.add('hidden');

    let studentMatches = document.getElementById('sp');
    studentMatches.classList.remove('hidden');
  }

  function backToChooseTeacher() {
    let studentPage = document.getElementById('teacher-profile');
    studentPage.classList.add('hidden');

    let studentMatches = document.getElementById('sp');
    studentMatches.classList.remove('hidden');
  }

  // this will be a function we will use to get components from the html file
  function id(id) {
    return document.getElementById(id);
  }
})();
