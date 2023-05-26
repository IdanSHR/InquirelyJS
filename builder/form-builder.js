document.addEventListener('DOMContentLoaded', function () {
    const questionInput = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const typeSelect = document.getElementById('type');
    const requiredCheckbox = document.getElementById('required');
    const multipleCheckbox = document.getElementById('multiple');


    const addQuestionButton = document.getElementById('add-question');
    const previewContainer = document.getElementById('preview');
    const generateJsonButton = document.getElementById('generate-json');
    const jsonOutput = document.getElementById('json-output');
  
    const questions = [];
  
    addQuestionButton.addEventListener('click', function () {
      const question = {
        text: questionInput.value,
        type: typeSelect.value,
        answers: answerInput.value.split(',').map(answer => answer.trim()),
        required: requiredCheckbox.checked,
        multiple: multipleCheckbox.checked
      };
  
      questions.push(question);
      renderQuestions();
  
      // Reset input fields
      questionInput.value = '';
      answerInput.value = '';
      typeSelect.value = 'text';
      requiredCheckbox.checked = false;
    });
  
    generateJsonButton.addEventListener('click', function () {
      const jsonData = JSON.stringify(questions, null, 2);
      jsonOutput.value = jsonData;
    });
  
    function renderQuestions() {
      previewContainer.innerHTML = '';
      questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.textContent = `${index + 1} -  ${question.text}`;
        // Add styling or other elements based on the question type or options
  
        previewContainer.appendChild(questionElement);
      });
    }
})