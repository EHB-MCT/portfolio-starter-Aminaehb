// Initialize an array to store submitted data
let allSubmittedData = [];
let submittedData; // Declare submittedData in the global scope
let isFormSubmitted = false; // Add a flag to check if the form submission is complete
let currentStudentId;

// Event listeners for buttons
document.getElementById("submitStudentInfoBtn").addEventListener("click", submitStudentInfo);
document.getElementById("submitFitnessInfoBtn").addEventListener("click", submitFitnessInfo);
document.getElementById("deleteBtn").addEventListener("click", deleteRecord);
document.getElementById("updateBtn").addEventListener("click", updateRecord);

// Function to submit student info
async function submitStudentInfo() {
    try {
        // Get data from the student info form
        const formData = new FormData(document.getElementById("studentInfoForm"));

        // Make a POST request to create a new student record
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

        // Check if the response is successful
        if (response.ok) {
            const newStudentDataArray = await response.json();

            // Check if the array contains data and has the expected structure
            if (Array.isArray(newStudentDataArray) && newStudentDataArray.length > 0 && newStudentDataArray[0].id && newStudentDataArray[0].id.id) {
                const newStudentData = newStudentDataArray[0];
                allSubmittedData.push(newStudentData);

                currentStudentId = newStudentData.id.id;

                // Display the second form (Fitness Info) and hide the first form
                document.getElementById("studentInfoForm").classList.add("hidden");
                document.getElementById("fitnessInfoForm").classList.remove("hidden");

                // Show the "Delete," "Update," and "Submit Finally" buttons
                document.getElementById("actions").classList.remove("hidden");
            } else {
                console.error('Invalid or missing data in student info response:', newStudentDataArray);
            }
        } else {
            console.error('Error during student record creation:', response.statusText);
        }
    } catch (error) {
        console.error('Error during student info submission:', error);
    }
}

// Function to submit fitness info
async function submitFitnessInfo() {
    try {
        // Check if a student ID is available
        if (!currentStudentId) {
            console.error('Invalid or missing student ID for fitness info submission');
            return;
        }

        // Get data from the fitness info form
        const fitnessFormData = new FormData(document.getElementById("fitnessInfoForm"));

        // Get selected button answers for physical activity and quality of sleep
        const physicalActivityAnswers = getSelectedButtons("physical-activity-group");
        const qualityOfSleepAnswers = getSelectedButtons("quality-of-sleep-group");

        // Make a POST request to create a new fitness info record
        const response = await fetch(`/api/fitness_info`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "student_id": currentStudentId,
                "physical_activity": physicalActivityAnswers,
                "exercise_duration": fitnessFormData.get("exercise_duration"),
                "anxiety_control": fitnessFormData.get("anxiety_control"),
                "sleep_duration": fitnessFormData.get("sleep_duration"),
                "quality_of_sleep": qualityOfSleepAnswers,
            }),
        });

        // Check if the response is successful
        if (response.ok) {
            // Handle successful fitness info submission
            const fitnessInfoData = await response.json();

            // Log the fitness info data to the console
            console.log('Fitness Info Data:', fitnessInfoData);

            // Make a GET request to retrieve combined student and fitness info
            const studentResponse = await fetch(`/api/students/${currentStudentId}`);
            const studentData = await studentResponse.json();

            // Display the combined data
            displayCombinedData([studentData, fitnessInfoData]);
        } else {
            console.error('Error during fitness info submission:', response.statusText);
        }
    } catch (error) {
        console.error('Error during fitness info submission:', error);
    }
}


// Function to make a GET request for combined student and fitness info
async function getCombinedData(studentId) {
    try {
        // Make a GET request to retrieve student information
        const studentResponse = await fetch(`/api/students/${studentId}`);
        
        if (studentResponse.ok) {
            const studentData = await studentResponse.json();

            // Make a GET request to retrieve fitness info
            const fitnessResponse = await fetch(`/api/fitness_info/${studentId}`);

            if (fitnessResponse.ok) {
                const fitnessInfoData = await fitnessResponse.json();

                if (fitnessInfoData) {
                    // Combine student and fitness info data
                    const combinedData = [studentData, fitnessInfoData];
                    
                    // Display the combined data
                    displayCombinedData(combinedData);
                } else {
                    console.warn('Fitness info data is null:', fitnessInfoData);
                    
                    // Display student data even if fitness info is not available
                    const combinedData = [studentData, null];
                    displayCombinedData(combinedData);
                }
            } else if (fitnessResponse.status === 404) {
                console.warn('Fitness info data not found:', fitnessResponse.statusText);
                
                // Display student data even if fitness info is not available
                const combinedData = [studentData, null];
                displayCombinedData(combinedData);
            } else {
                console.error('Error fetching fitness info data:', fitnessResponse.status, fitnessResponse.statusText);
            }
        } else if (studentResponse.status === 404) {
            console.warn('Student data not found:', studentResponse.statusText);

            // Display an appropriate message or take corrective action
        } else {
            console.error('Error fetching student data:', studentResponse.status, studentResponse.statusText);
        }
    } catch (error) {
        console.error('Error during combined data retrieval:', error);
    }
}

// Function to display combined data
function displayCombinedData(combinedData) {
    const dataContainer = document.querySelector(".submitted-data-container");

    // Clear existing content
    dataContainer.innerHTML = "";

    // Display the combined data if it exists
    if (combinedData && combinedData.length === 2) {
        const [studentData, fitnessInfoData] = combinedData;

        // Display student information
        if (studentData && studentData.id) {
            dataContainer.innerHTML += `
                <div class="submitted-student" data-index="${studentData.id.id}">
                    <strong>First Name:</strong> ${studentData.first_name}<br>
                    <strong>Last Name:</strong> ${studentData.last_name}<br>
                    <strong>Age:</strong> ${studentData.age}<br>
                    <strong>Email:</strong> ${studentData.email}<br>
                </div>`;
        } else {
            console.error('Invalid or missing data properties in studentData:', studentData);
        }

        // Display fitness information if available
        if (fitnessInfoData && fitnessInfoData.id) {
            dataContainer.innerHTML += `
                <div class="submitted-fitness" data-index="${fitnessInfoData.id.id}">
                    <strong>Physical Activity:</strong> ${fitnessInfoData.physical_activity ? fitnessInfoData.physical_activity.join(", ") : 'N/A'}<br>
                    <strong>Exercise Duration:</strong> ${fitnessInfoData.exercise_duration || 'N/A'}<br>
                    <strong>Anxiety Control:</strong> ${fitnessInfoData.anxiety_control || 'N/A'}<br>
                    <strong>Sleep Duration:</strong> ${fitnessInfoData.sleep_duration || 'N/A'}<br>
                    <strong>Quality of Sleep:</strong> ${fitnessInfoData.quality_of_sleep ? fitnessInfoData.quality_of_sleep.join(", ") : 'N/A'}<br>
                </div>`;
        } else {
            console.error('Invalid or missing data properties in fitnessInfoData:', fitnessInfoData);
        }

        // Display buttons
        const deleteButton = `<button class="delete-button" data-student-id="${studentData.id.id}">Delete</button>`;
        const updateButton = `<button class="update-button" data-student-id="${studentData.id.id}">Update</button>`;
        const submitButton = `<button class="submit-button" data-student-id="${studentData.id.id}">Submit</button>`;
        dataContainer.innerHTML += `<div class="button-container">${deleteButton} ${updateButton} ${submitButton}</div>`;

        // Attach event listeners to the delete, update, and submit buttons
        document.querySelector('.delete-button').addEventListener('click', () => deleteRecord());
        document.querySelector('.update-button').addEventListener('click', () => updateRecord());
        document.querySelector('.submit-button').addEventListener('click', () => submitRecord());
    } else {
        console.error('Invalid or missing combinedData:', combinedData);
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
        const updatedFormData = new FormData(document.getElementById("fitnessInfoForm"));

        // Make the PUT request to update the fitness info record
        const updateResponse = await fetch(`/api/fitness_info/${currentStudentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "exercise_duration": updatedFormData.get("exercise_duration"),
                "anxiety_control": updatedFormData.get("anxiety_control"),
                "sleep_duration": updatedFormData.get("sleep_duration"),
                // Include other properties needed for the update
            }),
        });

        if (updateResponse.ok) {
            const updateResult = await updateResponse.json();

            if (updateResult.message === 'Fitness info updated successfully') {
                console.log('Fitness info updated successfully');

                // Retrieve the latest fitness info data from the server after the update
                const latestFitnessInfoResponse = await fetch(`/api/fitness_info/${currentStudentId}`);
                const latestFitnessInfoData = await latestFitnessInfoResponse.json();

                // Update the fitness info data in the array
                const dataIndex = allSubmittedData.findIndex(item => item.id.id === currentStudentId);

                if (dataIndex !== -1) {
                    allSubmittedData[dataIndex] = latestFitnessInfoData;

                    // Display updated data
                    displayCombinedData([null, latestFitnessInfoData]);

                    // Reset the form submission flag
                    isFormSubmitted = false;
                } else {
                    console.error('Data not found in the array:', latestFitnessInfoData);
                }
            } else {
                console.error('Error during fitness info update:', updateResult.message);
            }
        } else {
            console.error('Error during fitness info update:', updateResponse.statusText);
        }
    } catch (error) {
        console.error('Error during fitness info update:', error);
    }
}


// Function to update fitness info
function updateFitnessInfo(studentId) {
    try {
        // Set the form submission flag to false
        isFormSubmitted = false;

        // Call changeAnswers to populate the form with current data
        changeFitnessAnswers(studentId);

        // Show the fitness form and hide the thank you message
        document.getElementById("thankYouMessage").classList.add("hidden");
        document.getElementById("fitnessForm").classList.remove("hidden");
    } catch (error) {
        console.error('Error during fitness info update:', error);
    }
}

// Function to change fitness answers
function changeFitnessAnswers(studentId) {
    console.log('Fitness Info:', submittedData);

    const form = document.getElementById("fitnessInfoForm");


    // Assuming submittedData is an array of objects
    const firstSubmittedData = submittedData.find(student => student.id.id === studentId);

    if (firstSubmittedData) {
        // Populate form fields with original data
        Object.keys(firstSubmittedData).forEach(key => {
            // Correct key names to match those used in the FormData object
            const inputElement = form.querySelector(`[name="${key}"]`);

            // Update input values based on the type
            if (inputElement) {
                inputElement.value = firstSubmittedData[key];
            }
        });
    }

    // Show the fitness form and hide the thank you message
    document.getElementById("thankYouMessage").classList.add("hidden");
    document.getElementById("fitnessForm").classList.remove("hidden");
}

// Function to delete a record
async function deleteRecord() {
    try {
        if (!isFormSubmitted) {
            console.warn('Waiting for form submission to complete...');
            return;
        }

        // Check if submittedData is available and is an array with at least two elements
        if (!submittedData || !Array.isArray(submittedData) || submittedData.length < 2) {
            console.error('Invalid or missing fitness info submittedData:', submittedData);
            return;
        }

        // Extract the fitness info data at index 1
        const fitnessInfoData = submittedData[1];

        // Check if fitnessInfoData has the necessary properties
        if (!fitnessInfoData || !fitnessInfoData.id || !fitnessInfoData.id.id) {
            console.error('Invalid or missing fitness info data:', fitnessInfoData);
            return;
        }

        // Extract the id value from the nested structure (fitness info ID)
        const fitnessInfoId = fitnessInfoData.id.id;

        // Check if the fitnessInfoId is valid
        if (!fitnessInfoId) {
            console.error('Invalid or missing fitness info ID:', fitnessInfoId);
            return;
        }

        // Ask for confirmation before deleting
        const confirmation = confirm('Are you sure you want to delete this fitness info?');

        if (confirmation) {
            // Call the function to delete fitness info
            await deleteFitnessInfo(fitnessInfoId);

            // Clear submitted data
            clearSubmittedData();

            // Reset the form submission flag
            isFormSubmitted = false;

            // Show the go back link/button
            showElement("goBackLink");
        }
    } catch (error) {
        console.error('Error during record deletion:', error);
    }
}

// Function to delete fitness info
async function deleteFitnessInfo(fitnessInfoId) {
    try {
        // Make a DELETE request to delete the fitness info
        const response = await fetch(`/api/fitness_info/${fitnessInfoId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Fitness info deleted successfully');

            // Reset the fitness form
            resetFitnessForm();

            // Show the delete confirmation popup
            const confirmation = confirm('Fitness info deleted. Click "OK" to go back to the fitness form and restart.');
            if (confirmation) {
                // Redirect to the fitness form or any desired action
                window.location.href = 'fitness-form.html';
            }
        } else {
            console.error('Error during fitness info deletion:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error during fitness info deletion:', error);
    }
}


// Function to go back to the form
function goBackToForm() {
    // Reset the form and show it again
    resetFitnessForm();

    // Hide the go back link/button
    hideElement("goBackLink");
}


// Function to reset the fitness form
function resetFitnessForm() {
    // Reset the fitness form and show it again
    document.getElementById("fitnessForm").reset();
    hideElement("thankYouMessage");
    showElement("fitnessForm");
}

// Function to reset the form
function resetForm() {
    // Reset the form and show it again
    document.getElementById("fitnessInfoForm").reset();
    hideElement("thankYouMessage");
    showElement("fitnessForm");
}

// Function to clear submitted data
function clearSubmittedData() {
    // Clear the content of the submitted data display
    document.getElementById("submittedData").innerHTML = "";
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
// Function to toggle a button
function toggleButton(button) {
    if (!isFormSubmitted) {
        button.classList.toggle("clicked");
        console.log("Button state:", button.classList.contains("clicked") ? "clicked" : "not clicked");
    }
}

// Event listeners for buttons with the class "button-group"
document.querySelectorAll('.button-group button').forEach(button => {
    button.addEventListener('click', function () {
        toggleButton(this);
    });
});
