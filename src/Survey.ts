interface Question {
    questionId?: string;
    text: string;
    type: "text" | "email" | "tel" | "number" | "date" | "time" | "color" | "datetime-local" | "radio" | "checkbox" | "select" | "textarea" | "range" | "toggle" | "image" | "rating";
    maxCharacters?: number;
    required?: boolean;
    placeholder?: string;
    validation?: RegExp;
    options?: string[] | { label: string; value?: string }[];
    multiple?: boolean;
    minValue?: number;
    maxValue?: number;
    step?: number;
    customComponent?: any; // Update the type as per your custom component requirements
    conditional?: { questionId: string; value: string }[];
}

interface Options {
    webhookUrl?: string;
    style?: string;
}

class Survey {
    private container: HTMLElement | null;
    private questions: Question[] = [];
    private options: Options = {};

    constructor(containerId: string, questions: Question[], options?: Options) {
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

    private render() {
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

            console.table(data); // Do something with the data

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


        //Add styles
        console.log(this.options.style);
        if (this.options?.style) {
            this.applyCSS(this.options.style);
        }
    }

    private createQuestion(question: Question, index: number): HTMLElement {
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
            case "range":
            case "date":
            case "time":
            case "color":
            case "datetime-local":
                const input = this.createInputElement(question, `question-${index}`);
                fieldset.appendChild(input);
                break;

            case "radio":
            case "checkbox":
                question.options?.forEach((option) => {
                    const input = this.createInputElement(question, `question-${index}`);
                    input.value = typeof option === 'string' ? option : option.value ?? option.label;
                    fieldset.appendChild(input);

                    const optionLabel = document.createElement("label");
                    optionLabel.textContent = typeof option === 'string' ? option : option.label;
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

            case "image":
                const image = this.createImageUploadInput(question, `question-${index}`);
                fieldset.appendChild(image);
                break;

            case "toggle":
                const toggle = this.createBootstrapToggleInput(question, `question-${index}`);
                fieldset.appendChild(toggle);
                break;
            case "rating":
                const rating = this.createRatingInput(question, `question-${index}`);
                fieldset.appendChild(rating);
                break;
        }

        return fieldset;
    }

    private createInputElement(question: Question, name: string): HTMLInputElement {
        const input = document.createElement("input");
        input.type = question.type;
        input.name = name;
        input.classList.add(question.type === "checkbox" || question.type === "radio"|| question.type === "color" ? "form-check-input" : "form-control");

        if (question.required) {
            input.required = true;
        }
        if (question.maxCharacters) {
            input.maxLength = question.maxCharacters;
        }
        if (question.placeholder) {
            input.placeholder = question.placeholder;
        }
        if (question.type === "number" || question.type === "range") {
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

    private createSelectElement(question: Question, name: string): HTMLSelectElement {
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
            optionElement.value =typeof option === 'string' ? option : option.value ?? option.label;
            optionElement.textContent = typeof option === 'string' ? option : option.label;
            select.appendChild(optionElement);
        });
        return select;
    }

    private createTextAreaElement(question: Question, name: string): HTMLTextAreaElement {
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

    private createBootstrapToggleInput(question: Question, name: string): HTMLDivElement {
        const div = document.createElement("div");
        div.classList.add("form-check", "form-switch");
      
        const input = document.createElement("input");
        input.type = "checkbox";
        input.name = name;
        input.classList.add("form-check-input");
      
        if (question.required) {
          input.required = true;
        }
      
        const label = document.createElement("label");
        label.classList.add("form-check-label");
        label.appendChild(input);
      
        div.appendChild(label);
      
        return div;
    }

    private createImageUploadInput(question: Question, name: string): HTMLDivElement {
        const container = document.createElement("div");
        container.classList.add("image-upload-container");
      
        const input = document.createElement("input");
        input.type = "file";
        input.name = name;
        input.accept = "image/*";
        input.classList.add("image-upload-input");
      
        if (question.required) {
          input.required = true;
        }
      
        const label = document.createElement("label");
        label.classList.add("image-upload-label");
      
        const dropZone = document.createElement("div");
        dropZone.classList.add("image-upload-dropzone");
      
        const text = document.createElement("span");
        text.textContent = "Click to browse";
        text.classList.add("image-upload-text");
      
        dropZone.appendChild(text);
      
        label.appendChild(dropZone);
        label.appendChild(input);
        container.appendChild(label);

        input.addEventListener("change", this.handleImageUpload);
      
        return container;
    }

    private createRatingInput(question: Question, name: string): HTMLElement {
        const container = document.createElement("div");
        container.classList.add("rating-input");
      
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = name;
        container.appendChild(hiddenInput);
      
        for (let i = 1; i <= 5; i++) {
          const button = document.createElement("button");
          button.type = "button";
          button.classList.add("btn", "btn-outline-secondary", "btn-sm");
          button.textContent = i.toString();
          container.appendChild(button);
      
          button.addEventListener("click", () => {
            hiddenInput.value = i.toString();
            this.updateButtonStyles(container, i);
          });
        }
      
        return container;
      }
      

    private getAnswers() {
        const form = this.container?.querySelector("form") as HTMLFormElement;
        const formData = new FormData(form);

        const data: any = {};
        for (const [key, value] of formData.entries()) {
            if (data[key]) {
                data[key].push(value);
            } else {
                data[key] = [value];
            }
        }

        return data;
    }

    private applyCSS(style: string) {
        const head = document.head || document.getElementsByTagName("head")[0];

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `../dist/css/${style}.css`;

        head.appendChild(link);
    }
    
    private handleImageUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        const imageUploadInput = document.querySelector(".image-upload-container") as HTMLImageElement;
        if (files?.length === 0 || !imageUploadInput) {
            event.preventDefault();
            return ;
        }
            
      
        const reader = new FileReader();
        reader.onload = (e) => {
          const imagePreview = document.createElement("img");
          imagePreview.src = e.target?.result as string;
          imageUploadInput.appendChild(imagePreview);
        };
        if(files !== null)
            reader.readAsDataURL(files[0] as Blob);
    }

    private updateButtonStyles(container: HTMLElement, rating: number) {
        const buttons = container.querySelectorAll("button");
        buttons.forEach((button, index) => {
          if (index < rating) {
            button.classList.remove("btn-outline-secondary");
            button.classList.add("btn-primary");
          } else {
            button.classList.remove("btn-primary");
            button.classList.add("btn-outline-secondary");
          }
        });
      }
      
      
}
