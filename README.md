
# 📊 SurveyJS 📊

 🚀 Create interactive surveys with ease! 📝
SurveyJS is a powerful front-end library that enables you to create dynamic and interactive surveys effortlessly. With a wide range of question types and flexible customization options, you can gather valuable feedback and insights from your users.

## Features

-   🌈 Beautiful and modern design (Bootstrap 5)
-   🎨 Customizable themes included
-   📝 Support for multiple question types (radio, checkbox, text, select, range, toggle, image)
-   🌐 Webhook integration for capturing survey responses
-   🧹 Clear button for resetting the form
-   🚀 Easy to use and deploy
-   🔒 Ability to set questions as required or optional
-   🔄 Conditional logic to show/hide questions based on previous answers
-   🌍 Multilingual support and RTL for creating surveys in different languages
-   📱   Mobile-responsive design for surveys on different devices
-   🧩 Pre-built survey templates for common use cases

## Usage

1. Clone the repository or download dist files
2. Include the `survey.css` and `survey.js` files in your project
3. Create an HTML container element for the survey (e.g. `<div id="survey-container"></div>`)
4. Create an array of survey questions with the following format:

   ```javascript
   const questions = [ 
   {
	  text: "What is your name?",
	  type: "text",
	  maxCharacters: 100,
	  required: true,
	  placeholder: "Enter your name" 
	}, {
	  text: "What is your email address?",
	  type: "email",
	  required: true,
	  placeholder: "Enter your email"
	}, { 
	  text: "Choose an option:",
	  type: "radio",
	  required: true,
	  options: [ "Option 1", "Option 2", "Option 3"]
	}];

5. Instantiate a new Survey object with the questions array and the ID of the survey container element:

   ```javascript
   const survey = new Survey("survey-container", questions, opts);

## Objects Reference

### Question
|Key            |Description                                      |Variable Type                                  |Optional|
|---------------|-------------------------------------------------|-----------------------------------------------|--------|
|questionId     |Unique identifier for the question               |string                                         |Optional|
|text           |The text of the question                         |string                                         |Required|
|type           |The type of the question                         |text                                           |Required|
|maxCharacters  |Maximum number of characters allowed in the input|number                                         |Optional|
|required       |Indicates if the question is required            |boolean                                        |Optional|
|placeholder    |Placeholder text for the input field             |string                                         |Optional|
|validation     |Regular expression for input validation          |RegExp                                         |Optional|
|options        |Array of options for select, checkbox, or radio  |string[] or { label: string; value?: string }[]|Optional|
|multiple       |Indicates if multiple options can be selected    |boolean                                        |Optional|
|minValue       |Minimum value for range or number inputs         |number                                         |Optional|
|maxValue       |Maximum value for range or number inputs         |number                                         |Optional|
|step           |Step value for range or number inputs            |number                                         |Optional|
|customComponent|Custom component for rendering the question      |any                                            |Optional|
|conditional    |Conditional logic for showing/hiding the question|{ questionId: string; value: string }[]        |Optional|


### Options

|Key            |Description                                      |Variable Type                                  |Optional|
|---------------|-------------------------------------------------|-----------------------------------------------|--------|
|webhookUrl     |The URL for notify when client submit data       |string                                         |Optional|
|style          |The text of the question                         |string                                         |Optional|




<a href="https://www.buymeacoffee.com/idanshr" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-1.svg" alt="buy me a coffee" width="200px"/></a>
