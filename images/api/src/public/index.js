document.getElementById("submitBtn").addEventListener("click", submitForm);

async function submitForm() {
    const formData = new FormData(document.getElementById("fitnessForm"));
    const submittedDataDiv = document.getElementById("submittedData");

    const submittedData = {
        "first_name": formData.get("firstname"),
        "last_name": formData.get("lastname"),
        "age": formData.get("age"),
        "email": formData.get("email"),
    };

    // Display submitted data and show thank you message
    submittedDataDiv.innerHTML = Object.entries(submittedData).map(([key, value]) => `<strong>${key}:</strong> ${value}<br>`).join('');
    document.getElementById("thankYouMessage").classList.remove("hidden");
    document.getElementById("fitnessForm").classList.add("hidden");

    try {
        // Send a POST request to the server with the submitted data
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submittedData),
        });

        if (response.ok) console.log('Form submitted successfully!');
        else console.error('Form submission failed.');
    } catch (error) {
        console.error('Error during form submission:', error);
    }
}


function changeAnswers() {
    const form = document.getElementById("fitnessForm");

    // Populate form fields with submitted data
    Object.keys(submittedData).forEach(key => {
        const inputElement = form.elements[key.toLowerCase()];

        // Update input values based on the type
        if (inputElement) {
            inputElement.value = submittedData[key];
        }

        // Handle button groups
        if (inputElement && inputElement.type === "button") {
            const buttonGroup = document.getElementById(`${key.toLowerCase()}-group`);

            // Deselect all buttons
            document.querySelectorAll(`#${key.toLowerCase()}-group button`).forEach(button => {
                button.classList.remove("selected");
            });

            // Select buttons based on submittedData
            submittedData[key].forEach(selectedButton => {
                const button = buttonGroup.querySelector(`button:contains('${selectedButton}')`);
                if (button) {
                    button.classList.add("selected");
                }
            });
        }
    });

    // Show the form and hide the thank you message
    document.getElementById("thankYouMessage").classList.add("hidden");
    document.getElementById("fitnessForm").classList.remove("hidden");
}



function deleteData() {
    // Reset the form and clear submitted data
    resetForm();
    submittedData = {};
    // Clear displayed submitted data
    clearSubmittedData();
}

function resetForm() {
    // Reset the form and show it again
    document.getElementById("fitnessForm").reset();
    hideElement("thankYouMessage");
    showElement("fitnessForm");
}

function getSelectedButtons(groupId) {
    // Get the text content of selected buttons in a button group
    const groupElement = document.getElementById(groupId);
    return groupElement ? Array.from(groupElement.querySelectorAll("button.clicked")).map(button => button.textContent) : [];
}

function hideElement(elementId) {
    // Hide the element with the given ID
    document.getElementById(elementId).classList.add("hidden");
}

function showElement(elementId) {
    // Show the element with the given ID
    document.getElementById(elementId).classList.remove("hidden");
}

function clearSubmittedData() {
    // Clear the content of the submitted data display
    document.getElementById("submittedData").innerHTML = "";
}
