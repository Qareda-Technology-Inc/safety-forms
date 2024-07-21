let improvementDescriptionIndex = 1;

function addImprovementDescription() {
    const container = document.getElementById('improvementDescriptionsContainer');
    const newFieldset = document.createElement('div');
    newFieldset.className = 'form-row improvement-description grid grid-cols-4 gap-4';
    newFieldset.innerHTML = `
        <div>
            <label for="improvementDescriptions[${improvementDescriptionIndex}][description]">Improvement Description:</label>
            <textarea name="improvementDescriptions[${improvementDescriptionIndex}][description]" class="form-textarea"></textarea>
            <div class="form-error" id="descriptionError${improvementDescriptionIndex}"></div>
        </div>
        <div>
            <label for="improvementDescriptions[${improvementDescriptionIndex}][by]">By:</label>
            <input type="text" name="improvementDescriptions[${improvementDescriptionIndex}][by]" class="form-input" placeholder="Name...">
            <div class="form-error" id="byError${improvementDescriptionIndex}"></div>
        </div>
        <div>
            <label for="improvementDescriptions[${improvementDescriptionIndex}][date]">Date:</label>
            <input type="date" name="improvementDescriptions[${improvementDescriptionIndex}][date]" class="form-input">
            <div class="form-error" id="dateError${improvementDescriptionIndex}"></div>
        </div>
    `;
    container.appendChild(newFieldset);
    improvementDescriptionIndex++;
}

function validateForm() {
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');

    // Validate required fields
    const doneBy = document.getElementById('doneBy').value.trim();
    const interactionPersonnel = document.getElementById('interactionPersonnel').value.trim();
    const areaDept = document.getElementById('areaDept').value;
    const significantAspects = document.getElementById('significantAspects').value.trim();
    const issuesConcerns = document.getElementById('issuesConcerns').value.trim();
    const opportunitiesForImprovement = document.getElementById('opportunitiesForImprovement').value.trim();

    if (!doneBy) {
        document.getElementById('doneByError').textContent = 'This field is required.';
        isValid = false;
    }
    if (!interactionPersonnel) {
        document.getElementById('interactionPersonnelError').textContent = 'This field is required.';
        isValid = false;
    }
    if (!areaDept) {
        document.getElementById('areaDeptError').textContent = 'Please select a department.';
        isValid = false;
    }
    if (!significantAspects) {
        document.getElementById('significantAspectsError').textContent = 'This field is required.';
        isValid = false;
    }
    if (!issuesConcerns) {
        document.getElementById('issuesConcernsError').textContent = 'This field is required.';
        isValid = false;
    }
    if (!opportunitiesForImprovement) {
        document.getElementById('opportunitiesForImprovementError').textContent = 'This field is required.';
        isValid = false;
    }

    // Validate improvement descriptions
    document.querySelectorAll('.improvement-description').forEach((fieldset, index) => {
        const description = fieldset.querySelector(`[name="improvementDescriptions[${index}][description]"]`).value.trim();
        const by = fieldset.querySelector(`[name="improvementDescriptions[${index}][by]"]`).value.trim();
        const date = fieldset.querySelector(`[name="improvementDescriptions[${index}][date]"]`).value.trim();

        if (!description) {
            document.getElementById(`descriptionError${index}`).textContent = 'This field is required.';
            isValid = false;
        }
        if (!by) {
            document.getElementById(`byError${index}`).textContent = 'This field is required.';
            isValid = false;
        }
        if (!date) {
            document.getElementById(`dateError${index}`).textContent = 'This field is required.';
            isValid = false;
        }
    });

    return isValid;
}

document.getElementById('sirForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting via HTTP (default behavior)

    if (!validateForm()) {
        return; // Stop form submission if validation fails
    }

    document.getElementById('loadingIndicator').classList.add('active');

    const formData = new FormData(this);
    const object = {};
    formData.forEach((value, key) => {
        if (key.includes('[')) {
            const keys = key.split(/[\[\]]/).filter(k => k);
            keys.reduce((obj, k, i) => {
                if (i === keys.length - 1) {
                    if (!obj[k]) obj[k] = [];
                    obj[k].push(value);
                } else {
                    if (!obj[k]) obj[k] = isNaN(keys[i + 1]) ? {} : [];
                }
                return obj[k];
            }, object);
        } else {
            object[key] = value;
        }
    });

    const url = 'http://localhost:7854/api/safety-interaction-records/add-forms';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(object)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loadingIndicator').classList.remove('active');
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('sirForm').reset();
        document.getElementById('improvementDescriptionsContainer').innerHTML = `
            <div class="form-row improvement-description grid grid-cols-4 gap-4">
                <div>
                    <label for="improvementDescriptions[0][description]">Improvement Description:</label>
                    <textarea name="improvementDescriptions[0][description]" class="form-textarea"></textarea>
                </div>
                <div>
                    <label for="improvementDescriptions[0][by]">By:</label>
                    <input type="text" name="improvementDescriptions[0][by]" class="form-input" placeholder="Name...">
                </div>
                <div>
                    <label for="improvementDescriptions[0][date]">Date:</label>
                    <input type="date" name="improvementDescriptions[0][date]" class="form-input">
                </div>
            </div>
        `;
        improvementDescriptionIndex = 1;
    })
    .catch(error => {
        document.getElementById('loadingIndicator').classList.remove('active');
        document.getElementById('errorMessage').style.display = 'block';
        console.error('Error:', error);
    });
});
