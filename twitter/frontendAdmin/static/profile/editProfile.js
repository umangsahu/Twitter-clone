function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function getProfileForSet() {
    const csrfToken = getCookie('csrftoken');
    const profileImageInput = document.getElementById('profile-image');
    const profileImagePreview = document.getElementById('profile-image-preview'); // Assuming there's an img tag or preview container
    const firstNameInput = document.getElementById('profile-first-name');
    const bioInput = document.getElementById('profile-bio');
    const lastNameInput = document.getElementById('profile-last-name');

    try {
        const res = await fetch('/api/get-profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            }
        });

        if (res.ok) {
            const data = await res.json();
            // Update the form fields with fetched data
            firstNameInput.value = data.user.first_name;
            bioInput.value = data.user.bio;
            lastNameInput.value = data.user.last_name;
            
            if (data.user.image) {
                // Display the profile image in a preview container
                profileImagePreview.src = data.user.image;
            } else {
                profileImagePreview.src = ''; // Clear the preview if no image
            }
        } else {
            console.error('Failed to fetch profile');
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

const sendEditData = () => {
    const editForm = document.getElementById("edit-profile-form");
    getProfileForSet() 
    
    editForm.addEventListener('submit',(e)=>{
        e.preventDefault();

        const profileImage = document.getElementById('profile-image').files[0];
        const firstName = document.getElementById('profile-first-name').value;
        const bio = document.getElementById('profile-bio').value;
        const lastName = document.getElementById('profile-last-name').value;


        const formData = {
            first_name: firstName, 
            last_name:lastName, // assuming name input is for first name, adjust as needed
            bio: bio
        };
        
        if (profileImage) {
            const reader = new FileReader();
            reader.onloadend = async function() {
                formData.image = reader.result; // base64 encode image data
                await sendProfileData(formData);
            };
            reader.readAsDataURL(profileImage);
        } else {
            return alert("upload image");
        }

    })
}

async function sendProfileData(formData) {

        const response = await fetch('api/update-profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // assuming you have a function to get CSRF token
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        if(response.ok){
            window.location.reload()
        }

        const data = await response.json();
    
        
    }

sendEditData()
