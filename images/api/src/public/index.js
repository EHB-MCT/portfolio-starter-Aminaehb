// Initialize an array to store submitted data
let allSubmittedData = [];
let submittedData; // Declare submittedData in the global scope
let isFormSubmitted = false; // Add a flag to check if the form submission is complete

document.getElementById("submitBtn").addEventListener("click", submitForm);
document.getElementById("deleteBtn").addEventListener("click", deleteRecord);

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
            submittedData = await response.json(); // This is now an array

            // Check if submittedData is an array and not empty
            if (Array.isArray(submittedData) && submittedData.length > 0) {
                // Access the first element of the array
                const firstElement = submittedData[0];

                // Log the structure of the submittedData
                console.log('Structure of submittedData:', firstElement);
            } else {
                // Handle the case when submittedData is not in the expected format
                console.error('Invalid format of submittedData:', submittedData);
            }

            // Add the submitted data to the array
            allSubmittedData.push(...submittedData); // Spread the array elements

            // Display all submitted data
            displayAllSubmittedData();

            // Show thank you message and hide the form
            document.getElementById("thankYouMessage").classList.remove("hidden");
            document.getElementById("fitnessForm").classList.add("hidden");

            // Set the form submission flag to true
            isFormSubmitted = true;
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
    try {
        // Check if form submission is complete
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
        const studentId = submittedData[0].id.id;

        const response = await fetch(`/api/students/${studentId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Record deleted successfully');
            // Remove the deleted record from the array
            allSubmittedData = allSubmittedData.filter(data => data.id !== studentId);
            // Display updated data
            displayAllSubmittedData();
            // Clear the submittedData variable
            submittedData = null;
        } else {
            // Keep the statusText in the console log for other potential errors
           // console.error('Error during record deletion:', response.statusText);
        }
    } catch (error) {
       // console.error('Error during record deletion:', error);
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
 