class Survey {
    private container: HTMLElement | null;
    private questions: Question[];
    private options: Options;

    constructor(containerId: string, questions: Question[], options?: Options) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Could not find container element with ID ${containerId}`);
            return;
        }
        this.questions = questions;

        if (options?.webhookUrl) {
            this.options.webhookUrl = options?.webhookUrl;
        }

        this.render();
    }

    private render() {
        const form = document.createElement("form");
        const h2 = document.createElement("h2");
        h2.textContent = "My Beautiful Survey";
        form.appendChild(h2);

        this.questions.forEach((question, index) => {
            const fieldset = document.createElement("fieldset");
            const legend = document.createElement("legend");
            legend.textContent = `Question ${index + 1}`;
            fieldset.appendChild(legend);

            const label = document.createElement("label");
            label.textContent = question.text;
            fieldset.appendChild(label);

            switch (question.type) {
                case "text":
                case "email":
                case "tel":
                case "number":
                case "date":
                case "time":
                case "datetime-local": {
                    const input = document.createElement("input");
                    input.type = question.type;
                    input.name = `question-${index}`;
                    fieldset.appendChild(input);
                    break;
                }
                case "radio":
                case "checkbox": {
                    question.answers?.forEach((option) => {
                        const input = document.createElement("input");
                        input.type = question.type;
                        input.name = `question-${index}`;
                        input.value = option;
                        fieldset.appendChild(input);

                        const optionLabel = document.createElement("label");
                        optionLabel.textContent = option;
                        fieldset.appendChild(optionLabel);
                    });
                    break;
                }
                case "select": {
                    const select = document.createElement("select");
                    select.name = `question-${index}`;
                    question.answers?.forEach((option) => {
                        const optionElement = document.createElement("option");
                        optionElement.value = option;
                        optionElement.textContent = option;
                        select.appendChild(optionElement);
                    });
                    fieldset.appendChild(select);
                    break;
                }
                case "textarea": {
                    const textarea = document.createElement("textarea");
                    textarea.name = `question-${index}`;
                    fieldset.appendChild(textarea);
                    break;
                }
            }

            form.appendChild(fieldset);
        });

        const submitButton = document.createElement("input");
        submitButton.type = "submit";
        submitButton.value = "Submit";
        form.appendChild(submitButton);

        const clearButton = document.createElement("input");
        clearButton.type = "button";
        clearButton.value = "Clear";
        clearButton.addEventListener("click", () => {
            form.reset();
        });
        form.appendChild(clearButton);

        this.container?.appendChild(form);

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(form);

            const data = {};
            for (const [key, value] of formData.entries()) {
                if (data[key]) {
                    data[key].push(value);
                } else {
                    data[key] = [value];
                }
            }

            console.log(data); // Do something with the data

            // Send webhook with data
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
                } catch (error) {
                    console.error("Webhook error:", error);
                }
            }
        });
    }

    public clear() {
        const form = this.container?.querySelector("form") as HTMLFormElement;
        form.reset();
    }

    public getAnswers() {
        const form = this.container?.querySelector("form") as HTMLFormElement;
        const formData = new FormData(form);

        const data = {};
        for (const [key, value] of formData.entries()) {
            if (data[key]) {
                data[key].push(value);
            } else {
                data[key] = [value];
            }
        }

        return data;
    }
}

interface Question {
    text: string;
    type: "text" | "email" | "tel" | "number" | "date" | "time" | "datetime-local" | "radio" | "checkbox" | "select" | "textarea";
    answers?: string[];
}
interface Options {
    webhookUrl?: string;
}
// Example usage
const questions: Question[] = [
    {
        text: "What is your favorite color?",
        type: "radio",
        answers: ["Red", "Blue", "Green", "Yellow"],
    },
    {
        text: "What is your favorite animal?",
        type: "checkbox",
        answers: ["Dog", "Cat", "Bird", "Fish"],
    },
];
