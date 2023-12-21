// Initialize an array to store submitted data
let allSubmittedData = [];
let submittedData; // Declare submittedData in the global scope
let isFormSubmitted = false; // Add a flag to check if the form submission is complete
let currentStudentId;

// Event listeners for buttons
document.getElementById("submitBtn").addEventListener("click", submitForm);
document.getElementById("deleteBtn").addEventListener("click", deleteRecord);
document.getElementById("updateBtn").addEventListener("click", updateRecord);


// Function to submit the form
async function submitForm() {
    const formData = new FormData(document.getElementById("fitnessForm"));
    let response = null;
    let existingStudentId; // Declare existingStudentId here

    try {
        // Check if the student already exists
        const existingStudent = allSubmittedData.find(student => student.email === formData.get("email"));

        if (existingStudent) {
            existingStudentId = existingStudent.id;
            console.log('Existing Student ID:', existingStudentId);

            if (!currentStudentId) {
                currentStudentId = existingStudentId;
            }

            // Make a PUT request to update the existing student record
            response = await fetch(`/api/students/${existingStudentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "first_name": formData.get("firstname"),
                    "last_name": formData.get("lastname"),
                    "age": formData.get("age"),
                    "email": formData.get("email"),
                }),
            });

            if (response.ok) {
                try {
                    // Retrieve the updated data from the response
                    const updatedData = await response.json();

                    // Update the display with the updated data
                    submittedData = allSubmittedData.filter(student => student.id === currentStudentId);
                    allSubmittedData.push(...submittedData);
                    displayAllSubmittedData();

                    // Reset the form submission flag
                    isFormSubmitted = false;

                    // Hide the "Delete" and "Update" buttons
                    document.getElementById("deleteBtn").classList.add("hidden");
                    document.getElementById("updateBtn").classList.add("hidden");

                    // Update the thank you message
                    document.getElementById("thankYouText").textContent = "Thank you for sharing your final answers! We'll soon send an email with tips on staying healthy during college!";

                    document.getElementById("thankYouMessage").classList.remove("hidden");
                    document.getElementById("fitnessForm").classList.add("hidden");
                } catch (error) {
                    console.error('Error parsing updated data:', error);
                }
            } else {
                console.error('Error during record update:', response.statusText);
            }

            return;
        }

        // If the student is new, make a POST request to create a new record
        response = await fetch('/api/students', {
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
            // Handle a successful response (new record created)
            submittedData = await response.json();

            if (Array.isArray(submittedData) && submittedData.length > 0) {
                const firstElement = submittedData[0];
                currentStudentId = firstElement.id.id;  // Correctly access the nested ID
                console.log('Structure of submittedData:', firstElement);
            } else {
                console.error('Invalid format of submittedData:', submittedData);
            }

            allSubmittedData.push(...submittedData);
            displayAllSubmittedData();

            // Set the form submission flag to true only after a successful response
            isFormSubmitted = true;
            console.log('Form submitted successfully. isFormSubmitted:', isFormSubmitted);

            // Show the thank you message and hide the form
            document.getElementById("thankYouMessage").classList.remove("hidden");
            document.getElementById("fitnessForm").classList.add("hidden");
        } else {
            console.error('Form submission failed.');
        }
    } catch (error) {
        console.error('Error during form submission:', error);
    }
}


// Function to display all submitted data
function displayAllSubmittedData() {
    const firstDataContainer = document.querySelector(".first-submitted-data-container");
    const updatedDataContainer = document.querySelector(".updated-submitted-data-container");

    // Log some information for debugging
    console.log('allSubmittedData:', allSubmittedData);
    console.log('submittedData:', submittedData);

    // Clear existing content
    firstDataContainer.innerHTML = "";
    updatedDataContainer.innerHTML = "";

    // Display the first submitted data if it exists
    if (allSubmittedData.length > 0) {
        const firstSubmittedData = allSubmittedData[0];
        firstDataContainer.innerHTML = `
            <div class="submitted-student" data-index="${firstSubmittedData.id}">
                <strong>First Name:</strong> ${firstSubmittedData.first_name}<br>
                <strong>Last Name:</strong> ${firstSubmittedData.last_name}<br>
                <strong>Age:</strong> ${firstSubmittedData.age}<br>
                <strong>Email:</strong> ${firstSubmittedData.email}<br>
            </div>`;
    }

    // Helper function to check if two student objects have the same data
    function isDataEqual(student1, student2) {
        return (
            student1.id.id === student2.id.id &&
            student1.first_name === student2.first_name &&
            student1.last_name === student2.last_name &&
            student1.age === student2.age &&
            student1.email === student2.email
        );
    }

    // Display the updated submitted data only if it exists and it's not the same as the first submitted data
    if (submittedData && submittedData.length > 0 && !isDataEqual(submittedData[0], allSubmittedData[0])) {
        updatedDataContainer.innerHTML = submittedData.map(student => {
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
}


// Function to delete a record
async function deleteRecord() {
    try {
        if (!isFormSubmitted) {
            console.warn('Waiting for form submission to complete...');
            return;
        }

        // Check if submittedData is available and is an array
        if (!submittedData || !Array.isArray(submittedData) || submittedData.length === 0 || !submittedData[0].id) {
            console.error('Invalid or missing submittedData');
            return;
        }

        // Extract the id value from the nested structure
        const studentId = submittedData[0]?.id?.id;

        // Check if the studentId is valid
        if (!studentId) {
            console.error('Invalid or missing student ID');
            return;
        }

        // Make a DELETE request to delete the record
        const response = await fetch(`/api/students/${studentId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Record deleted successfully');

            // Clear submitted data
            clearSubmittedData();

            // Reset the form
            resetForm();

            // Reset the form submission flag
            isFormSubmitted = false;

            // Show the delete confirmation popup
            const confirmation = confirm('You have just deleted your form. Click "OK" to go back to the form and restart.');
            if (confirmation) {
                // Redirect to the form or any desired action
                window.location.href = 'index.html';
            }
        } else {
            console.error('Error during record deletion:', response.statusText);
        }
    } catch (error) {
        console.error('Error during record deletion:', error);
    }
}


// Function to update a record
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

                    // Reset the form submission flag
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


// Function to change answers
function changeAnswers() {
    console.log('Submitted Data:', submittedData);

    const form = document.getElementById("fitnessForm");

    // Assuming submittedData is an array of objects
    const firstSubmittedData = submittedData[0];

    if (firstSubmittedData) {
        // Populate form fields with original data
        Object.keys(firstSubmittedData).forEach(key => {
            // Correct key names to match those used in the FormData object
            const inputElement = form.querySelector(`[name="${key === 'id' ? 'id.id' : key.toLowerCase()}"]`);

            // Update input values based on the type
            if (inputElement) {
                // Check if the field is 'id' and has a nested structure
                if (key === 'id' && typeof firstSubmittedData[key] === 'object' && firstSubmittedData[key].id) {
                    inputElement.value = firstSubmittedData[key].id.id;  // Correctly access the nested ID
                } else {
                    inputElement.value = firstSubmittedData[key];
                }
            }
        });
    }

    // Show the form and hide the thank you message
    document.getElementById("thankYouMessage").classList.add("hidden");
    document.getElementById("fitnessForm").classList.remove("hidden");
}


// Modify the event listener for the "Update" button
document.getElementById("updateBtn").addEventListener("click", async () => {
    // Reset the form submission flag
    isFormSubmitted = false;

    // Call changeAnswers to populate the form with current data
    changeAnswers();

    // Show the form and hide the thank you message
    document.getElementById("thankYouMessage").classList.add("hidden");
    document.getElementById("fitnessForm").classList.remove("hidden");
});

// Function to reset the form
function resetForm() {
    // Reset the form and show it again
    document.getElementById("fitnessForm").reset();
    hideElement("thankYouMessage");
    showElement("fitnessForm");
}

// Function to get selected buttons in a button group
function getSelectedButtons(groupId) {
    // Get the text content of selected buttons in a button group
    const groupElement = document.getElementById(groupId);
    return groupElement ? Array.from(groupElement.querySelectorAll("button.clicked")).map(button => button.textContent) : [];
}

// Function to hide an element
function hideElement(elementId) {
    // Hide the element with the given ID
    document.getElementById(elementId).classList.add("hidden");
}

// Function to show an element
function showElement(elementId) {
    // Show the element with the given ID
    document.getElementById(elementId).classList.remove("hidden");
}

// Function to clear submitted data
function clearSubmittedData() {
    // Clear the content of the submitted data display
    document.getElementById("submittedData").innerHTML = "";
}
