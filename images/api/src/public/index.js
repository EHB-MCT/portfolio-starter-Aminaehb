// Initialize an array to store submitted data
let allSubmittedData = [];
let submittedData; // Declare submittedData in the global scope
let isFormSubmitted = false; // Add a flag to check if the form submission is complete
let currentStudentId;

document.getElementById("submitBtn").addEventListener("click", submitForm);
document.getElementById("deleteBtn").addEventListener("click", deleteRecord);
document.getElementById("updateBtn").addEventListener("click", updateRecord);

async function submitForm() {
    const formData = new FormData(document.getElementById("fitnessForm"));

    try {
        const existingStudent = allSubmittedData.find(student => student.email === formData.get("email"));

        if (existingStudent) {
            console.log('Email already exists. Updating the existing record:', formData.get("email"));

            const existingStudentId = existingStudent.id;
            console.log('Existing Student ID:', existingStudentId);

            if (!currentStudentId) {
                currentStudentId = existingStudentId;
            }

            const updateResponse = await fetch(`/api/students/${existingStudentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "first_name": formData.get("firstname"),
                    "last_name": formData.get("lastname"),
                    "age": formData.get("age"),
                    "email": formData.get("email"),
                }),
            });

            if (updateResponse.ok) {
                try {
                    const updatedData = await updateResponse.json();
                    // Update the display with the updated data
                    allSubmittedData.push(updatedData);
                    displayAllSubmittedData();

                    isFormSubmitted = false;
                    document.getElementById("thankYouMessage").classList.remove("hidden");
                    document.getElementById("fitnessForm").classList.add("hidden");
                } catch (error) {
                    console.error('Error parsing updated data:', error);
                }
            } else {
                console.error('Error during record update:', updateResponse.statusText);
            }

            return;
        }

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

            if (Array.isArray(submittedData) && submittedData.length > 0) {
                const firstElement = submittedData[0];
                currentStudentId = firstElement.id.id;
                console.log('Structure of submittedData:', firstElement);
            } else {
                console.error('Invalid format of submittedData:', submittedData);
            }

            allSubmittedData.push(...submittedData);
            displayAllSubmittedData();

            // Set the form submission flag to true only after a successful response
            isFormSubmitted = true;
            console.log('Form submitted successfully. isFormSubmitted:', isFormSubmitted);

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
    const allStudentsDiv = document.querySelector(".submitted-data-container");
    allStudentsDiv.innerHTML = allSubmittedData.map(student => {
        return `
            <div class="submitted-student" data-index="${student.id}">
                <strong>First Name:</strong> ${student.first_name}<br>
                <strong>Last Name:</strong> ${student.last_name}<br>
                <strong>Age:</strong> ${student.age}<br>
                <strong>Email:</strong> ${student.email}<br>
            </div>
        `;
    }).join('<hr>');
}

async function updateDisplayAfterSubmit(updatedData) {
    // No need for additional fetch, just update the display
    allSubmittedData.push(updatedData);
    displayAllSubmittedData();
}


async function deleteRecord() {
    try {
        // Check if form submission is complete
        if (!isFormSubmitted) {
            console.warn('Waiting for form submission to complete...');

            // Wait for form submission to complete (use a loop with a delay)
            while (!isFormSubmitted) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100 milliseconds
            }
        }

        // Check if submittedData is available and is an array
        if (!submittedData || !Array.isArray(submittedData) || submittedData.length === 0 || !submittedData[0].id) {
            console.error('Invalid or missing submittedData');
            return;
        }

        // Extract the id value from the nested structure
        const studentId = submittedData[0].id.id;

        const response = await fetch(`/api/students/${studentId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Record deleted successfully');

            // Clear submitted data
            clearSubmittedData();

            // Reset the form
            resetForm();

            // Set the form submission flag to false
            isFormSubmitted = false;

            // Show the delete confirmation popup
            showDeleteConfirmation();
        } else {
            console.error('Error during record deletion:', response.statusText);
        }
    } catch (error) {
        console.error('Error during record deletion:', error);
    }
}

function showDeleteConfirmation() {
    // Create a div element for the popup
    const popupContainer = document.createElement('div');
    popupContainer.className = 'delete-confirmation';
    popupContainer.innerHTML = 'Record deleted successfully!';

    // Style the popup
    popupContainer.style.position = 'fixed';
    popupContainer.style.top = '50%';
    popupContainer.style.left = '50%';
    popupContainer.style.transform = 'translate(-50%, -50%)';
    popupContainer.style.padding = '15px';
    popupContainer.style.background = 'red';
    popupContainer.style.color = 'white';
    popupContainer.style.borderRadius = '8px';
    popupContainer.style.zIndex = '999';

    // Append the popup to the body
    document.body.appendChild(popupContainer);

    // Remove the popup after a few seconds (adjust as needed)
    setTimeout(() => {
        popupContainer.remove();
    }, 3000);
}





async function updateRecord() {
    try {
        // Check if form submission is complete
        if (!isFormSubmitted) {
            console.warn('Waiting for form submission to complete...');
            return;
        }

        // Check if a student ID is available
        if (!currentStudentId) {
            console.error('Invalid or missing student ID');
            return;
        }

        // Get the updated data from the form
        const updatedFormData = new FormData(document.getElementById("fitnessForm"));

        // Make the PUT request to update the student record
        const updateResponse = await fetch(`/api/students/${currentStudentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "first_name": updatedFormData.get("firstname"),
                "last_name": updatedFormData.get("lastname"),
                "age": updatedFormData.get("age"),
                "email": updatedFormData.get("email"),
            }),
        });

        if (updateResponse.ok) {
            const updateResult = await updateResponse.json();

            if (updateResult.message === 'Student updated successfully') {
                console.log('Record updated successfully');

                // Retrieve the latest data from the server after the update
                const latestDataResponse = await fetch(`/api/students/${currentStudentId}`);
                const latestData = await latestDataResponse.json();

                // Update the data in the array
                const dataIndex = allSubmittedData.findIndex(student => student.id.id === currentStudentId);
                if (dataIndex !== -1) {
                    allSubmittedData[dataIndex] = latestData;

                    // Display updated data
                    displayAllSubmittedData();

                    // Set the form submission flag to false
                    isFormSubmitted = false;

                    // Set currentStudentId to the updated ID
                    currentStudentId = latestData.id.id;
                } else {
                    console.error('Data not found in the array:', latestData);
                }
            } else {
                console.error('Error during record update:', updateResult.message);
            }
        } else {
            console.error('Error during record update:', updateResponse.statusText);
        }
    } catch (error) {
        console.error('Error during record update:', error);
    }
}

function changeAnswers() {
    const form = document.getElementById("fitnessForm");

    // Populate form fields with updated data
    Object.keys(submittedData).forEach(key => {
        const inputElement = form.elements[key.toLowerCase()];

        // Update input values based on the type
        if (inputElement) {
            inputElement.value = submittedData[key];
        }
    });

    // Show the form and hide the thank you message
    document.getElementById("thankYouMessage").classList.add("hidden");
    document.getElementById("fitnessForm").classList.remove("hidden");
}

// Modify the event listener for the "Update" button
document.getElementById("updateBtn").addEventListener("click", async () => {
    // Set the form submission flag to false
    isFormSubmitted = false;

    // Call changeAnswers to populate the form with current data
    changeAnswers();

    // Show the form and hide the thank you message
    document.getElementById("thankYouMessage").classList.add("hidden");
    document.getElementById("fitnessForm").classList.remove("hidden");
});

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
