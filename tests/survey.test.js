const { Survey } = require("../dist/js/Survey");

const  { render, fireEvent } = require("@testing-library/dom") // Import testing utilities for DOM manipulation

describe("Survey", () => {
  let container

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
  })

  // Helper function to create a question
  const createQuestion = (text, type, required = false) => {
    return { text, type, required }
  }

  it("renders the survey form correctly", () => {
    const questions = [
      createQuestion("What is your name?", "text", true),
      createQuestion("What is your favorite color?", "radio", true, [
        "Red",
        "Blue",
        "Green"
      ])
    ]

    const survey = new Survey(container.id, questions)

    expect(container.querySelector("form")).toBeInTheDocument()
    expect(container.querySelectorAll(".question-title").length).toBe(
      questions.length
    )
    expect(container.querySelectorAll(".btn").length).toBe(2) // Submit and Clear buttons
  })

  it("submits the survey form and calls the webhook", async () => {
    const questions = [
      createQuestion("What is your name?", "text", true),
      createQuestion("What is your favorite color?", "radio", true, [
        "Red",
        "Blue",
        "Green"
      ])
    ]

    const webhookUrl = "https://example.com/webhook"

    const survey = new Survey(container.id, questions, { webhookUrl })

    // Render the survey form
    render(container)

    // Fill in the form inputs
    const nameInput = container.querySelector('input[name="question-0"]')
    fireEvent.change(nameInput, { target: { value: "John Doe" } })

    const colorInput = container.querySelector(
      'input[name="question-1"][value="Blue"]'
    )
    fireEvent.click(colorInput)

    // Submit the form
    const submitButton = container.querySelector('input[type="submit"]')
    fireEvent.click(submitButton)

    // Verify that the webhook is called with the correct data
    const expectedData = {
      "question-0": ["John Doe"],
      "question-1": ["Blue"]
    }

    const mockFetch = jest.fn().mockResolvedValue({ json: jest.fn() })
    global.fetch = mockFetch

    await survey["submitForm"]()

    expect(mockFetch).toHaveBeenCalledWith(
      webhookUrl,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(expectedData),
        headers: {
          "Content-Type": "application/json"
        }
      })
    )
  })
})
