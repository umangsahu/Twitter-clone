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


const sendEditData = () => {
    const editForm = document.getElementById("edit-profile-form");
    
    editForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        const profileImage = document.getElementById('profile-image').files[0];
        const name = document.getElementById('profile-name').value;
        const bio = document.getElementById('profile-bio').value;


        const formData = {
            first_name: name, // assuming name input is for first name, adjust as needed
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

        const data = await response.json();
    
        console.log(data);
    }

sendEditData()
