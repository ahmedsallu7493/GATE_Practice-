// Application state
const appState = {
    allQuestions: [],
    answeredQuestions: [],
    currentQuestion: null,
    stats: {
      total: 0,
      correct: 0,
      wrong: 0
    }
  };
  
  // DOM elements
  const elements = {
    questionContainer: document.getElementById('question-container'),
    progressText: document.getElementById('progress-text'),
    feedbackContainer: document.getElementById('feedback-container'),
    feedbackMessage: document.getElementById('feedback-message'),
    solutionContainer: document.getElementById('solution-container'),
    solutionText: document.getElementById('solution-text'),
    solutionImage: document.getElementById('solution-image'),
    nextBtn: document.getElementById('next-btn'),
    resetBtn: document.getElementById('reset-btn'),
    testCompleteContainer: document.getElementById('test-complete-container'),
    testCompleteMessage: document.getElementById('test-complete-message')
  };
  
  // Initialize the application
  function init() {
    try {
      // Prepare questions
      appState.allQuestions = [...questionsData.questions];
      appState.answeredQuestions = [];
      
      // Set up event listeners
      elements.nextBtn.addEventListener('click', showNextQuestion);
      elements.resetBtn.addEventListener('click', resetAll);
      
      // Show first question
      showNextQuestion();
      
      // Hide loading message
      document.querySelector('.loading-message').classList.add('hidden');
    } catch (error) {
      console.error('Error initializing application:', error);
      document.querySelector('.loading-message').textContent = 'Error initializing application.';
    }
  }
  
  // Show a random question
  function showNextQuestion() {
    // Hide feedback and test complete containers
    elements.feedbackContainer.classList.add('hidden');
    elements.testCompleteContainer.classList.add('hidden');
    
    // Reset question container
    elements.questionContainer.innerHTML = '';
    
    // Get available questions (not yet answered in this session)
    const availableQuestions = appState.allQuestions.filter(
      q => !appState.answeredQuestions.includes(q.year + "-" + q.questionNumber)
    );
    
    // If all questions have been shown
    if (availableQuestions.length === 0) {
      showTestComplete();
      return;
    }
    
    // Select a random question
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    appState.currentQuestion = availableQuestions[randomIndex];
    
    // Add to answered questions
    appState.answeredQuestions.push(appState.currentQuestion.year + "-" + appState.currentQuestion.questionNumber);
    appState.stats.total++;
    
    // Update progress
    updateProgress();
    
    // Render the question
    renderQuestion(appState.currentQuestion);
  }
  
  // Show test complete screen
  function showTestComplete() {
    elements.questionContainer.innerHTML = '';
    elements.testCompleteMessage.innerHTML = `
      <h2>Test Complete!</h2>
      <p>Total Questions: ${appState.stats.total}</p>
      <p>Correct Answers: ${appState.stats.correct}</p>
      <p>Wrong Answers: ${appState.stats.wrong}</p>
      <p>Score: ${Math.round((appState.stats.correct / appState.stats.total) * 100)}%</p>
    `;
    elements.testCompleteContainer.classList.remove('hidden');
  }
  
  // Render a question to the DOM
  function renderQuestion(question) {
    const container = document.createElement('div');
    
    // Question text
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.textContent = `Q.${question.questionNumber} ${question.questionText}`;
    container.appendChild(questionDiv);
    
    // Question image (if exists)
    if (question.questionImage) {
      const questionImg = document.createElement('img');
      questionImg.src = question.questionImage;
      questionImg.alt = 'Question diagram';
      questionImg.className = 'question-image';
      container.appendChild(questionImg);
    }
    
    // Options
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    
    question.options.forEach(opt => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'option';
      optionDiv.dataset.option = opt.option;
      optionDiv.textContent = `${opt.option}) ${opt.text}`;
      
      optionDiv.addEventListener('click', function() {
        checkAnswer(opt.option, question.correctAnswer);
      });
      
      optionsDiv.appendChild(optionDiv);
    });
    
    container.appendChild(optionsDiv);
    elements.questionContainer.appendChild(container);
  }
  
  // Check the selected answer
  function checkAnswer(selectedOption, correctAnswer) {
    const isCorrect = selectedOption === correctAnswer;
    
    // Update stats
    if (isCorrect) {
      appState.stats.correct++;
    } else {
      appState.stats.wrong++;
    }
    
    // Mark options
    const options = document.querySelectorAll('.option');
    options.forEach(opt => {
      opt.classList.remove('selected');
      if (opt.dataset.option === correctAnswer) {
        opt.classList.add('correct');
      } else if (opt.dataset.option === selectedOption && !isCorrect) {
        opt.classList.add('incorrect');
      }
    });
    
    // Show feedback
    showFeedback(isCorrect);
    
    // Update progress
    updateProgress();
  }
  
  // Show feedback and solution
  function showFeedback(isCorrect) {
    // Set feedback message
    elements.feedbackMessage.textContent = isCorrect 
      ? 'Correct! Well done.' 
      : 'Incorrect. Here is the solution:';
    elements.feedbackMessage.className = isCorrect 
      ? 'correct-feedback' 
      : 'incorrect-feedback';
    
    // Set solution (only show if answer was wrong)
    if (!isCorrect) {
      elements.solutionText.textContent = appState.currentQuestion.solutionText;
      elements.solutionContainer.classList.remove('hidden');
      
      if (appState.currentQuestion.solutionImage) {
        elements.solutionImage.src = appState.currentQuestion.solutionImage;
        elements.solutionImage.alt = 'Solution diagram';
        elements.solutionImage.classList.remove('hidden');
      } else {
        elements.solutionImage.classList.add('hidden');
      }
    } else {
      elements.solutionContainer.classList.add('hidden');
    }
    
    // Show feedback container
    elements.feedbackContainer.classList.remove('hidden');
  }
  
  // Update progress display
  function updateProgress() {
    elements.progressText.textContent = 
      `Questions: ${appState.stats.total} | ` +
      `Correct: ${appState.stats.correct} | ` +
      `Wrong: ${appState.stats.wrong}`;
  }
  
  // Reset all progress
  function resetAll() {
    appState.answeredQuestions = [];
    appState.stats = {
      total: 0,
      correct: 0,
      wrong: 0
    };
    updateProgress();
    showNextQuestion();
  }
  
  // Initialize the app when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    init();
    
    // Add event listener for restart button
    document.getElementById('restart-btn').addEventListener('click', resetAll);
  });
  // Initialize the app when DOM is loaded
  document.addEventListener('DOMContentLoaded', init);