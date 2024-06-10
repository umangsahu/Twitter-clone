const wordCounterFunc=()=>{
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

const toggleModal=(component)=>{
    console.log(component);
    const modal = document.getElementById("modal");

    if(modal.style.display!=='none'){
        modal.style.display="none";
    }else{
        modal.style.display="flex";
    }
    console.log(modal);

    // if(component==="createPost"){
        
    // }
    // if(component==="editProfile"){
    //     console.log();

    // }
    
}



wordCounterFunc()


