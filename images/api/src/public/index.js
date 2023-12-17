document.getElementById("submitBtn").addEventListener("click", submitForm);
document.getElementById("deleteBtn").addEventListener("click", deleteRecord);

// Initialize an array to store submitted data
let allSubmittedData = [];

async function submitForm() {
    const formData = new FormData(document.getElementById("fitnessForm"));

    try {
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "first_name": formData.get("firstname"),
                "last_name": formData.get("lastname"),
                "age": formData.get("age"),
                "email": formData.get("email"),
            }),
        });

        if (response.ok) {
            submittedData = await response.json();
            console.log('Form submitted successfully:', submittedData);
            
            // Add the submitted data to the array
            allSubmittedData.push(submittedData);

            // Display all submitted data
            displayAllSubmittedData();

            // Show thank you message and hide the form
            document.getElementById("thankYouMessage").classList.remove("hidden");
            document.getElementById("fitnessForm").classList.add("hidden");
        } else {
            console.error('Form submission failed.');
        }
    } catch (error) {
        console.error('Error during form submission:', error);
    }
}


function displayAllSubmittedData() {
    // Display all submitted data in the 'allStudentsData' div
    const allStudentsDiv = document.querySelector(".submitted-data-container");
    allStudentsDiv.innerHTML = allSubmittedData.map(submittedData => {
        return `
            <div class="submitted-student">
                <strong>First Name:</strong> ${submittedData.first_name}<br>
                <strong>Last Name:</strong> ${submittedData.last_name}<br>
                <strong>Age:</strong> ${submittedData.age}<br>
                <strong>Email:</strong> ${submittedData.email}<br>
            </div>
        `;
    }).join('<hr>');
}

async function deleteRecord() {
    // Now you can use the submittedData variable here
    try {
        const response = await fetch(`/api/students/${submittedData.id}`, {
            method: 'DELETE',
        });

        // ... (rest of your existing code)
    } catch (error) {
        console.error('Error during record deletion:', error);
    }
}


// ... (rest of your code remains unchanged)


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
