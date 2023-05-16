"use strict";
class Survey {
    constructor(containerId, questions, options) {
        this.questions = [];
        this.options = {};
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Could not find container element with ID ${containerId}`);
            return;
        }
        this.questions = questions;
        if (options) {
            this.options = options;
        }
        this.render();
    }
    render() {
        const form = document.createElement("form");
        form.classList.add("surveyForm");
        this.questions.forEach((question, index) => {
            form.appendChild(this.createQuestion(question, index));
        });
        const submitButton = document.createElement("input");
        submitButton.type = "submit";
        submitButton.value = "Submit";
        submitButton.classList.add("btn");
        submitButton.classList.add("btn-primary");
        form.appendChild(submitButton);
        const clearButton = document.createElement("input");
        clearButton.type = "button";
        clearButton.value = "Clear";
        clearButton.classList.add("btn");
        clearButton.classList.add("btn-secondary");
        clearButton.addEventListener("click", () => {
            form.reset();
        });
        form.appendChild(clearButton);
        this.container?.appendChild(form);
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const data = this.getAnswers();
            console.table(data);
            if (this.options?.webhookUrl) {
                try {
                    const response = await fetch(this.options.webhookUrl, {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    console.log("Webhook response:", await response.json());
                }
                catch (error) {
                    console.error("Webhook error:", error);
                }
            }
        });
        console.log(this.options.style);
        if (this.options?.style) {
            this.applyCSS(this.options.style);
        }
    }
    createQuestion(question, index) {
        const fieldset = document.createElement("fieldset");
        const legend = document.createElement("legend");
        legend.textContent = `Question ${index + 1}`;
        fieldset.appendChild(legend);
        const label = document.createElement("label");
        label.classList.add("question-title");
        label.textContent = question.text;
        if (question.required) {
            label.classList.add("required");
        }
        fieldset.appendChild(label);
        switch (question.type) {
            case "text":
            case "email":
            case "tel":
            case "number":
            case "date":
            case "time":
            case "datetime-local":
                const input = this.createInputElement(question, `question-${index}`);
                fieldset.appendChild(input);
                break;
            case "radio":
            case "checkbox":
                question.answers?.forEach((option) => {
                    const input = this.createInputElement(question, `question-${index}`);
                    input.value = option;
                    fieldset.appendChild(input);
                    const optionLabel = document.createElement("label");
                    optionLabel.textContent = option;
                    optionLabel.classList.add("form-check-label");
                    fieldset.appendChild(optionLabel);
                });
                break;
            case "select":
                const select = this.createSelectElement(question, `question-${index}`);
                fieldset.appendChild(select);
                break;
            case "textarea":
                const textarea = this.createTextAreaElement(question, `question-${index}`);
                fieldset.appendChild(textarea);
                break;
        }
        return fieldset;
    }
    createInputElement(question, name) {
        const input = document.createElement("input");
        input.type = question.type;
        input.name = name;
        input.classList.add(question.type === "checkbox" || question.type === "radio" ? "form-check-input" : "form-control");
        if (question.required) {
            input.required = true;
        }
        if (question.maxCharacters) {
            input.maxLength = question.maxCharacters;
        }
        if (question.placeholder) {
            input.placeholder = question.placeholder;
        }
        if (question.type === "number") {
            if (question.minValue) {
                input.min = question.minValue.toString();
            }
            if (question.maxValue) {
                input.max = question.maxValue.toString();
            }
            if (question.step) {
                input.step = question.step.toString();
            }
        }
        return input;
    }
    createSelectElement(question, name) {
        const select = document.createElement("select");
        select.name = name;
        select.classList.add("form-control");
        if (question.required) {
            select.required = true;
        }
        if (question.multiple) {
            select.multiple = true;
        }
        question.options?.forEach((option) => {
            const optionElement = document.createElement("option");
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            select.appendChild(optionElement);
        });
        return select;
    }
    createTextAreaElement(question, name) {
        const textarea = document.createElement("textarea");
        textarea.name = name;
        textarea.classList.add("form-control");
        if (question.required) {
            textarea.required = true;
        }
        if (question.maxCharacters) {
            textarea.maxLength = question.maxCharacters;
        }
        if (question.placeholder) {
            textarea.placeholder = question.placeholder;
        }
        return textarea;
    }
    getAnswers() {
        const form = this.container?.querySelector("form");
        const formData = new FormData(form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            if (data[key]) {
                data[key].push(value);
            }
            else {
                data[key] = [value];
            }
        }
        return data;
    }
    applyCSS(style) {
        const head = document.head || document.getElementsByTagName("head")[0];
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `../dist/css/${style}.css`;
        head.appendChild(link);
    }
}
