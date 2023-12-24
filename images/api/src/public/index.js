// Initialize an array to store submitted data
let allSubmittedData = [];
let submittedData = [null, null]; // Initialize submittedData with two null elements
let isFormSubmitted = false; // Add a flag to check if the form submission is complete
let currentStudentId;
let currentFitnessFormId;



// Event listeners for buttons
document.getElementById("submitStudentInfoBtn").addEventListener("click", submitStudentInfo);
document.getElementById("submitFitnessInfoBtn").addEventListener("click", submitFitnessInfo);
document.getElementById("deleteBtn").addEventListener("click", deleteRecord);
document.getElementById("updateBtn").addEventListener("click", updateRecord);
document.getElementById("submitFinallyBtn").addEventListener("click", submitFinally);

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
                console.log('Submitting student info - hiding student form and showing fitness form');
                hideElement("studentInfoForm");
                showElement("fitnessInfoForm");
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

        // Ensure that physicalActivityAnswers is not null
        const physicalActivity = physicalActivityAnswers.length > 0 ? physicalActivityAnswers : null;

        
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
            const responseData = await response.json();
            console.log('Server Response Data:', responseData); // Log the response data

            // Check if the response indicates success
            if (responseData.message === 'Fitness info created successfully') {
                console.log('Fitness info created successfully');

                // Set the form submission flag to true
                isFormSubmitted = true;

    currentFitnessFormId = responseData.data.id || currentFitnessFormId;

                // Set the submittedData variable with the server response data
                submittedData = [null, responseData.data]; // Update the entire array

                // Log the submittedData to check its contents
                console.log('submittedData:', submittedData);

                await waitForFormSubmissionCompletion();


                // Hide the fitness form and show the confirmation container along with the buttons
                hideElement("fitnessInfoForm");
                showElement("confirmationContainer");
                showElement("deleteBtn");
                showElement("updateBtn");
                showElement("submitFinallyBtn");
            } else {
                console.error('Error during fitness info submission:', responseData.message);
            }
        } else {
            console.error('Error during fitness info submission:', response.statusText);
        }
    } catch (error) {
        console.error('Error during fitness info submission:', error);
    }
}

// Function to wait for form submission completion
async function waitForFormSubmissionCompletion() {
    while (!isFormSubmitted) {
        await new Promise(resolve => requestAnimationFrame(resolve));
    }
}


// Function to submit the form finally
function submitFinally() {
    try {
        // Hide the buttons
        hideElement("deleteBtn");
        hideElement("updateBtn");
        hideElement("submitFinallyBtn");
        hideElement("confirmationText"); // Add this line to hide the confirmation text


        // Show the thank you message
        document.getElementById("thankYouText").classList.remove("hidden");
    } catch (error) {
        console.error('Error during final form submission:', error);
    }
}


// Function to update submitted data
async function updateSubmittedData() {
    // Set the form submission flag to true
    isFormSubmitted = true;

    // Make another request to get the latest data from the server
    const latestFitnessInfoResponse = await fetch(`/api/fitness_info/${currentStudentId}`);
    const latestFitnessInfoData = await latestFitnessInfoResponse.json();

    // Check if the response is successful
    if (latestFitnessInfoResponse.ok) {
        // Set the submittedData variable with the server response data
        submittedData = [null, latestFitnessInfoData];

        // Log the submittedData to check its contents
        console.log('submittedData:', submittedData);
    } else if (latestFitnessInfoResponse.status === 404) {
        // Handle the case where the fitness information is not found
        console.warn('Fitness info not found for ID:', currentStudentId);
        console.warn('Server Response:', latestFitnessInfoResponse.statusText);

        // Optionally, you can show a user-friendly message or perform other actions
        alert('Fitness information not found for the selected student.');
    } else {
        console.error('Error retrieving existing fitness info:', latestFitnessInfoResponse.statusText);

        // Optionally, you can log additional details or show an error message
        alert('An error occurred while retrieving fitness information. Please try again later.');
    }
}

// Function to delete fitness info for a student
async function deleteFitnessInfo(fitnessFormId) {
    const url = `/api/fitness_info/${fitnessFormId}`;
    console.log('Deleting fitness info. URL:', url);

    try {
        // Make a DELETE request to delete fitness info for the student
        const response = await fetch(url, {
            method: 'DELETE',
        });

        // Check if the response is successful
        if (response.ok) {
            // The server should return a JSON object with a 'message' property
            const responseData = await response.json();
            console.log(responseData.message);  // Log the success message

            // Optionally, you can perform additional actions after deletion if needed
        } else {
            console.error('Error during fitness info deletion:', response.status, response.statusText);

            // Log more details about the error
            const errorData = await response.json();
            console.error('Error Data:', errorData);

            // Optionally, you can display an error message to the user
            alert('Error during fitness info deletion. Please try again.');
        }
    } catch (error) {
        console.error('Error during fitness info deletion:', error);

        // Optionally, you can display an error message to the user
        alert('An unexpected error occurred during fitness info deletion. Please try again later.');
    }
}

// Updated deleteRecord function
async function deleteRecord() {
    try {
        console.log('isFormSubmitted:', isFormSubmitted);
        console.log('submittedData:', submittedData);

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

        console.log('fitnessInfoData before deletion:', fitnessInfoData);

        // Check if fitnessInfoData has the necessary properties, including 'id'
        if (!fitnessInfoData || !fitnessInfoData.id || !fitnessInfoData.id.id) {
            console.error('Invalid or missing fitness info data:', fitnessInfoData);
            return;
        }

        // Use the stored fitness form ID
        const fitnessFormIdObject = fitnessInfoData.id;
        const fitnessFormId = fitnessFormIdObject.id;

        console.log('fitnessFormId before deletion request:', fitnessFormId);

        // Make a request to get the latest data from the server
        const latestFitnessInfoResponse = await fetch(`/api/fitness_info/${fitnessFormId}`);
        const latestFitnessInfoData = await latestFitnessInfoResponse.json();

        // Check if the response is successful
        if (latestFitnessInfoResponse.ok) {
            // Now, you can use latestFitnessInfoData to perform the deletion
            await deleteFitnessInfo(fitnessFormId);

            // Optionally, update the submittedData after deletion
            submittedData = [null, null];

            // Log the updated submittedData
            console.log('submittedData after deletion:', submittedData);
        } else if (latestFitnessInfoResponse.status === 404) {
            // Handle the case where the fitness information is not found
            console.warn('Fitness info not found for ID:', fitnessFormId);
            console.warn('Server Response:', latestFitnessInfoResponse.statusText);

            // Optionally, you can show a user-friendly message or perform other actions
            alert('Fitness information not found for the selected student.');
        } else {
            console.error('Error retrieving existing fitness info:', latestFitnessInfoResponse.statusText);

            // Optionally, you can log additional details or show an error message
            alert('An error occurred while retrieving fitness information. Please try again later.');
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

        // Retrieve the existing fitness info for the student
        const existingFitnessInfoResponse = await fetch(`/api/fitness_info/${currentStudentId}`);
        const existingFitnessInfoData = await existingFitnessInfoResponse.json();

        // Check if the response is successful
        if (existingFitnessInfoResponse.ok) {
            // Pre-fill the form with existing fitness information
            prefillFitnessForm(existingFitnessInfoData);

            // Show the fitness form for updates
            showElement("fitnessInfoForm");

            // Hide the confirmation container and buttons
            hideElement("confirmationContainer");
            hideElement("deleteBtn");
            hideElement("updateBtn");
            hideElement("submitFinallyBtn");

            // Reset the form submission flag
            isFormSubmitted = false;
        } else if (existingFitnessInfoResponse.status === 404) {
            // Handle the case where the fitness information is not found
            console.warn('Fitness info not found for ID:', currentStudentId);
            console.warn('Server Response:', existingFitnessInfoResponse.statusText);

            // Optionally, you can show a user-friendly message or perform other actions
            alert('Fitness information not found for the selected student.');
        } else {
            console.error('Error retrieving existing fitness info:', existingFitnessInfoResponse.statusText);

            // Optionally, you can log additional details or show an error message
            alert('An error occurred while retrieving fitness information. Please try again later.');
        }
    } catch (error) {
        console.error('Error during fitness info update:', error);

        // Optionally, you can log additional details or show an error message
        alert('An unexpected error occurred. Please try again later.');
    }
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
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

// Function to show an element
function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
    }
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
