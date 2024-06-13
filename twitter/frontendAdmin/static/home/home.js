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
    const textArea = document.getElementById('new-post-content');
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
    const modal = document.getElementById("modal");
    const createPost = document.getElementById('create-post')
    const editProfile = document.getElementById('edit-profile')
    const modalHeading = document.getElementById('modal-heading')
    const exploreSection = document.getElementById('explore-section')
    const pendingRequestSection = document.getElementById('pending-request-section')

    if (modal.style.display !== 'none') {
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
    }

    editProfile.style.display = 'none'
    exploreSection.style.display = 'none'
    createPost.style.display = 'none'
    pendingRequestSection.style.display = 'none'


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
    } else if (component === 'PENDINGREQUEST') {
        pendingRequestSection.style.display = 'block'
        modalHeading.innerHTML = 'Pending Request'
    }

}



const userFeed = async () => {

    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''
    const response = await fetch('/user-posts');
    // console.log(response);
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
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 9v12H1V9zm4 12a2 2 0 0 1-2-2V9c0-.55.22-1.05.59-1.41L14.17 1l1.06 1.06c.27.27.44.64.44 1.05l-.03.32L14.69 8H21a2 2 0 0 1 2 2v2c0 .26-.05.5-.14.73l-3.02 7.05C19.54 20.5 18.83 21 18 21zm0-2h9.03L21 12v-2h-8.79l1.13-5.32L9 9.03z"/></svg>
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
    postsContainer.innerHTML = ''
    const response = await fetch('api/get-post-of-friends');
    // console.log(response);
    if (response.ok) {
        const posts = await response.json();
        posts.posts.forEach(post => {
            getLike(`${post.id}`)
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.id = `post-home-${post.post_id}`
            const postDate = new Date(post.created_at);
            const formattedDate = postDate.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
            });
            postElement.innerHTML = `
            <div class="post-content-wrapper">
            <div class="post-content-upper">
                <div class="for-profile-img">
                </div>
                <div class="for-content">
                    <div class="post-header">
                    <p class="username">${post.user_username}</p>
                        <p class="date">${formattedDate}</p>
                    </div>
                    <div class="content-wrapper">
                        ${post.content}
                    </div>
                </div>
            </div>
            <div class="action-wrapper">
                <div class="svg-wrapper" onclick="likePost('${post.id}')" id="like-btn-${post.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 9v12H1V9zm4 12a2 2 0 0 1-2-2V9c0-.55.22-1.05.59-1.41L14.17 1l1.06 1.06c.27.27.44.64.44 1.05l-.03.32L14.69 8H21a2 2 0 0 1 2 2v2c0 .26-.05.5-.14.73l-3.02 7.05C19.54 20.5 18.83 21 18 21zm0-2h9.03L21 12v-2h-8.79l1.13-5.32L9 9.03z"/></svg>
                <span id="like-btn-counter-${post.id}"></span>
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

                        data.users.forEach(people => {

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

// function related to follower/following

const acceptRequest = async (id, follower_id) => {
    const csrfToken = getCookie('csrftoken')
    const res = await fetch(`api/accept-follow-request/${id}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        }

    })
    if (res.ok) {
        document.getElementById(`req-con-${follower_id}`).remove()
    }
    const data = await res.json()

}

const rejectRequest = async (id, follower_id) => {
    const csrfToken = getCookie('csrftoken')
    const res = await fetch(`api/reject-follow-request/${id}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        }

    })
    if (res.ok) {
        document.getElementById(`req-con-${follower_id}`).remove()
    }
    const data = await res.json()

}


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
        // console.log(data.message);
    }
}

const getPendingRequest = async () => {
    const pendingRequest = document.getElementById('pending-request-sidebar');
    const pendingRequestContainerModal = document.getElementById('pending-request-container');

    const csrfToken = getCookie('csrftoken'); // Assuming you have a function to get the CSRF token

    try {
        const res = await fetch('api/get-pending-request', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken // CSRF token for security, even though it's a GET request
            }
        });
        const data = await res.json();
        if (data.pending_requests.length > 0) {
            pendingRequest.innerHTML = `<span>Pending Request <sup style="color:var(--twitter-blue); font-size:0.8em;">(${data.pending_requests.length})</sup></span>`


            data.pending_requests.forEach(async (request) => {
                const res = await fetch(`api/get-user/${request.follower_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken // CSRF token for security, even though it's a GET request
                    }
                })
                const userData = await res.json();
                const requestContainer = document.createElement('div');
                requestContainer.classList.add("req-wrapper");
                requestContainer.id = `req-con-${request.follower_id}`;
                requestContainer.innerHTML = `
                <div class="profile-img">
                img
                </div>
                <div class="req-user-info">
                    <div class="profile">
                    ${userData.user.first_name} ${userData.user.last_name}
                    </div>
                    <div class="action-wrapper">
                        <button class="btn-accept" onclick=acceptRequest("${request.id}","${request.follower_id}")>Accept</button>
                        <button class="btn-reject" onclick=rejectRequest("${request.id}","${request.follower_id}")>Reject</button>
                    </div>
                </div>
                `;
                pendingRequestContainerModal.append(requestContainer)
            });
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

// post crudOperation


const createPost = () => {
    const form = document.getElementById('create-post-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        const textArea = document.getElementById('new-post-content');

        const csrfToken = getCookie('csrftoken')
        const res = await fetch('api/create-post', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ post: textArea.value })
        })
        const data = await res.json()
        if (data.message === "Post created successfully") {
            toggleModal()
            const body = document.getElementById('body');
            const temp = body.innerHTML;

            body.innerHTML = `
                <div style="padding:10px;color: white;border-radius:20px; position: absolute;top: 50px; left: calc(50% - 40px); background: #000; border:1px solid green; font-size:2rem; font-weight:800; display:flex; align-items:center; gap:5px">
                <svg style="color:green;" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M20.925 13.163A8.998 8.998 0 0 0 12 3a9 9 0 0 0 0 18M9 10h.01M15 10h.01"/><path d="M9.5 15c.658.64 1.56 1 2.5 1s1.842-.36 2.5-1m.5 4l2 2l4-4"/></g></svg>
                 ${data.message}
                </div>
            `;
            body.style = 'width:100%; height:100vh; background:#000;'

            setTimeout(() => {
                body.innerHTML = temp;
            }, 2000);
        }
    })


}


const deletePost = async (postId) => {
    console.log(postId);
    const csrfToken = getCookie('csrftoken'); // Ensure the CSRF token is available
    const response = await fetch(`api/delete-post/${postId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken// Include CSRF token in the request
        }
    });


    const data = await response.json()
    console.log(data);
    if (data.message === "Post deleted successfully") {
        const body = document.getElementById('body');
        const temp = body.innerHTML;

        body.innerHTML = `
            <div style="padding:10px;color: white;border-radius:20px; position: absolute;top: 50px; left: calc(50% - 40px); background: #000; border:1px solid green; font-size:2rem; font-weight:800; display:flex; align-items:center; gap:5px">
            <svg style="color:green;" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M20.925 13.163A8.998 8.998 0 0 0 12 3a9 9 0 0 0 0 18M9 10h.01M15 10h.01"/><path d="M9.5 15c.658.64 1.56 1 2.5 1s1.842-.36 2.5-1m.5 4l2 2l4-4"/></g></svg>
             ${data.message}
            </div>
        `;
        body.style = 'width:100%; height:100vh; background:#000;'

        setTimeout(() => {
            body.innerHTML = temp;
        }, 2000);
    }
}

const logOut = async () => {
    const csrfToken = getCookie('csrftoken');
    try {
        const res = await fetch('api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            }
        });
        if (res.ok) {
            const data = await res.json();

            if (data.status === 'ok') {
                console.log(data.redirect_url);
                window.location.href = data.redirect_url; // Redirect to your desired page
            } else {
                console.error('Logout failed:', data.message);
            }
        } else {
            console.error('Network response was not ok.');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

const likePost = async (postId) => {
    const csrfToken = getCookie('csrftoken');
    try {
        const res = await fetch(`/api/like-post/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            }
        });
        if (res.ok) {
            const data = await res.json();
            const likeButton = document.getElementById(`like-btn-${postId}`);
            const likeCount = document.getElementById(`like-btn-counter-${postId}`)
            if (data.liked) {
                likeButton.style.color = 'var(--twitter-blue)';
                // Change button text to 'Unlike' if liked
            } else {
                likeButton.style.color = 'white'; // Change button text to 'Like' if unliked
            }

            likeCount.innerHTML = `(${data.likes_count})`; // Update the like count
        } else {
            console.error('Network response was not ok.');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }

}
const getLike = async (postId) => {
    const res = await fetch(`api/like-count/${postId}`)
    const data = await res.json();
    const likeCount = document.getElementById(`like-btn-counter-${postId}`)
    const likeButton = document.getElementById(`like-btn-${postId}`);
    likeCount.innerHTML = `(${data.likes_count})`;
    if(data.liked===true){
        likeButton.style.color = 'var(--twitter-blue)';
    }
}
// const getUser
document.addEventListener('DOMContentLoaded', () => {
    activeFeed()
    findPeople()
    createPost()
    getPendingRequest()
})

wordCounterFunc()



