function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const wordCounterFunc = () => {
    const textArea = document.getElementById('post-content');
    const maxLength = textArea.getAttribute('maxlength');
    const wordCounter = document.getElementById('word-counter');
    const postBtn = document.getElementById("post-submit-btn")
    textArea.addEventListener('input', (event) => {
        const remainingLetters = maxLength - event.target.value.length
        wordCounter.innerHTML = `${remainingLetters}/${maxLength}`
        if (remainingLetters < 20) {
            wordCounter.style.color = `rgb(245, 5, 5)`
        } else {
            wordCounter.style.color = `white`
        }
    })
}

const toggleModal = (component) => {
    console.log('click');
    const modal = document.getElementById("modal");
    const createPost = document.getElementById('create-post')
    const editProfile = document.getElementById('edit-profile')
    const modalHeading = document.getElementById('modal-heading')
    const exploreSection = document.getElementById('explore-section')

    if (modal.style.display !== 'none') {
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
    }

    editProfile.style.display = 'none'
    exploreSection.style.display = 'none'
    createPost.style.display = 'none'


    if (component === "createPost") {
        createPost.style.display = 'block'
        modalHeading.innerHTML = 'Create Post'
    }
    else if (component === "editProfile") {
        editProfile.style.display = 'block'
        modalHeading.innerHTML = 'Edit Profile'
    } else if (component === 'EXPLORE') {
        exploreSection.style.display = 'block'
        modalHeading.innerHTML = 'Find New Peoples'
    }

}


// const usersPost = () => {
//     document.addEventListener('DOMContentLoaded', async () => {

// }
const userFeed = async () => {

    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''
    const response = await fetch('/user-posts');
    console.log(response);
    if (response.ok) {
        const posts = await response.json();
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.id = `post-home-${post.post_id}`
            postElement.innerHTML = `
            
            <div class="post-content-wrapper">
            <div class="post-content-upper">
                <div class="for-profile-img">
    
                </div>
                <div class="for-content">
                    <div class="post-header">
                        ${post.username}
                    </div>
                    <div class="content-wrapper">
                        ${post.content}
                    </div>
                </div>
            </div>
            <div class="action-wrapper">
                <div class="svg-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 48 48">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            d="M43 17.077c0-5.654-4.583-10.238-10.237-10.238c-3.723 0-6.971 1.993-8.763 4.964c-1.792-2.97-5.04-4.964-8.763-4.964C9.583 6.84 5 11.423 5 17.077c0 1.292.25 2.524.687 3.662C9.072 30.476 24 41.161 24 41.161s14.928-10.685 18.314-20.422c.437-1.138.686-2.37.686-3.662" />
                    </svg>
                </div>
                <div class="svg-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 32 32">
                        <path fill="currentColor"
                            d="M26.312 25.407s.141-.095.36-.261C29.948 22.61 32 18.938 32 14.855c0-7.62-7.161-13.808-15.995-13.808S0 7.235 0 14.855c0 7.619 7.161 13.807 15.995 13.807c1.131 0 2.26-.099 3.369-.307l.349-.057c2.245 1.452 5.516 2.651 8.38 2.651c.891 0 1.308-.729.74-1.469c-.864-1.063-2.057-2.76-2.521-4.072zm-1.948-6.032c-.952 1.423-3.911 3.849-8.337 3.849h-.063c-4.437 0-7.391-2.437-8.339-3.849a1.575 1.575 0 0 1-.365-.765a.658.658 0 0 1 .6-.703c.009-.005.015-.005.025-.005a.833.833 0 0 1 .437.151a12.185 12.185 0 0 0 7.672 2.74a11.76 11.76 0 0 0 7.683-2.745a.614.614 0 0 1 .416-.161c.355 0 .636.281.647.631a1.812 1.812 0 0 1-.36.859z" />
                    </svg>
                </div>
                <div class="svg-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 48 48">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            d="m30 15l-12.1 6.07m0 5.86l12.18 6.11m12.42 2.89a6.55 6.55 0 1 1-13.1 0a6.55 6.55 0 0 1 13.1 0m-.1-23.86a6.55 6.55 0 1 1-13.1 0a6.55 6.55 0 0 1 13.1 0M18.6 24a6.55 6.55 0 1 1-13.1 0a6.55 6.55 0 0 1 13.1 0" />
                    </svg>
                </div>
                <div class="svg-wrapper" onclick='deletePost("${post.post_id}")'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"/></svg>
                </div>
                <div class="svg-wrapper" onclick='editPost("${post.post_id}")'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"/><path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"/></g></svg>
                </div>
                
            </div> 
        </div>
        <hr>
            `;
            postsContainer.appendChild(postElement);
        });
    } else {
        postsContainer.innerHTML = '<p>Failed to load posts.</p>';
    }
}


const usersFriendsFeed = async () => {

    const postsContainer = document.getElementById('posts-container');
    const response = await fetch('/user-posts');
    console.log(response);
    if (response.ok) {
        const posts = await response.json();
        posts.forEach(post => {
            console.log(post);
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = ``;
            postsContainer.appendChild(postElement);
        });
    } else {
        postsContainer.innerHTML = '<p>Failed to load posts.</p>';
    }
}


const activeFeed = () => {

    const forYouDepart = document.getElementById('for-you');
    const yourPostDepart = document.getElementById('your-post');

    if (yourPostDepart.classList.contains('active')) {
        forYouDepart.classList.add('active')
        yourPostDepart.classList.remove('active')
        usersFriendsFeed()
    } else {
        forYouDepart.classList.remove('active')
        yourPostDepart.classList.add('active')
        userFeed()
    }
}

const findPeople = () => {
    const peopleContainer = document.getElementById('people-container');
    const input = document.getElementById('explore-input');

    input.addEventListener('input', async (e) => {
        const query = e.target.value.trim();

        peopleContainer.innerHTML = `
            <div class='explore-loading'>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10"/>
                </svg>
            </div>
        `;

        if (query !== '') {
            fetch(`/api/find-users?q=${query}`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Error in fetching data');
                    }
                })
                .then(data => {

                    if (data.users.length > 0) {
                        const peopleList = document.createElement('div');
                        peopleList.classList.add('explored-list-group');
                        console.log(data);
                        data.users.forEach(people => {
                            console.log(people);
                            const peopleListItem = document.createElement('div');
                            peopleListItem.classList.add('explored-list-item');

                            peopleListItem.innerHTML = `
                                <div class="e-profile-img"></div>
                                <div class="e-user-info" style="color:white">${people.first_name} ${people.last_name}</div>
                                <div class="e-btn-wrapper">
                                    <button onclick="sendRequest('${people.id}')" id="follow-${people.id}"> Follow </button>
                                </div>
                            `;
                            peopleList.appendChild(peopleListItem);
                        });

                        peopleContainer.innerHTML = '';
                        peopleContainer.appendChild(peopleList);
                    } else {
                        peopleContainer.innerHTML = 'No users found';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    // peopleContainer.innerHTML = 'Error in fetching data';
                });
        }
        // else {
        //     peopleContainer.innerHTML = '';
        // }
    });
};


const sendRequest = async (userId) => {
    const csrfToken = getCookie('csrftoken')
    const res = await fetch(`/api/send-follow-request/${userId}/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({ user_id: userId }) // Include any necessary data in the request body
    });
    const data = await res.json()
    if (data.message === "Follow request sent.") {
        const btnFollower = document.getElementById(`follow-${userId}`);
        btnFollower.innerHTML = `Sent`
        btnFollower.style = "background:white;border:1px solid var(--twitter-blue);color:var(--twitter-blue); cursor:not-allowed;"
        btnFollower.setAttribute('disabled', 'true');
        console.log(data.message);
    }




}


document.addEventListener('DOMContentLoaded', () => {
    activeFeed()
    findPeople()
})

wordCounterFunc()



