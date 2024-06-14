
const getConnections = async (tab) => {
    const followerTab = document.getElementById('follower')
    const followingTab = document.getElementById('following')
    const friendListContainer = document.getElementById('friends-list')

    if (tab === 'FOLLOWER') {
        friendListContainer.innerHTML = ''

        followerTab.classList.add("active")
        followingTab.classList.remove('active')
        const res = await fetch('api/get-follower')
        const data = await res.json();

        data.followers.forEach(follower => {
            const followerDiv = document.createElement('div');
            followerDiv.classList.add("friend-list");
            followerDiv.innerHTML = `            
            <div class="profile-section" >
                <div class="profile-img">img</div> 
                <div class="user-info">${follower.first_name} ${follower.last_name}</div>
            </div >
            <div class="button-wrapper">
                <button>Unfollow</button>
            </div>
            `
            friendListContainer.appendChild(followerDiv)
        })

    } else if (tab === 'FOLLOWING') {
        friendListContainer.innerHTML=''

        followerTab.classList.remove("active")
        followingTab.classList.add('active')
        const res = await fetch('api/get-follwing')
        const data = await res.json();

        data.following.forEach(following => {
            const followerDiv = document.createElement('div');
            followerDiv.classList.add("friend-list");
            followerDiv.innerHTML = `
        <div class="profile-section" >
                <div class="profile-img">img</div> 
                <div class="user-info">${following.first_name} ${following.last_name}</div>
            </div >
    <div class="button-wrapper">
        <button>delete</button>
    </div>
`
            friendListContainer.appendChild(followerDiv)
        })

}
}


document.addEventListener('DOMContentLoaded', () => {
    getConnections('FOLLOWER')

})