let advice = document.querySelector('.advice');
let id = document.querySelector('.idnum');
let btn = document.querySelector('.btn');
let sound = document.querySelector('.sound');
let heart = document.querySelector('.heart');
const url = 'https://api.adviceslip.com/advice';

let getAdvice = () => {
    fetch(url).then((data) => data.json()).then((item) => {
        advice.innerHTML = item.slip.advice;
        id.innerHTML = item.slip.id;
    }).catch((error) => {
        console.log(error);
    });
};

// Səs funksiyası
function speakAdvice() {
    let text = advice.innerHTML.trim();
    if (text) {
        let utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        speechSynthesis.resume(); 
        speechSynthesis.speak(utterance);
    }
}

// Sevimli funksiyası
function toggleHeart() {
    const heartIcon = heart.querySelector('i');
    const isFilled = heartIcon.classList.contains("fa-heart");
    
    if (isFilled) {
        heartIcon.classList.replace("fa-heart", "fa-heart-o");
    } else {
        heartIcon.classList.replace("fa-heart-o", "fa-heart");
    }
}

// Klaviatura hadisələri
document.addEventListener('keydown', function(event) {
    // Enter düyməsi - Yeni məsləhət
    if (event.key === 'Enter') {
        event.preventDefault();
        getAdvice(); // Yalnız yeni advice 
    }
    
    // Space düyməsi - Səs oynat
    else if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault(); // Səhifə scroll etməsini dayandır
        speakAdvice(); // Yalnız səsi oynat
    }
    
    // Plus düyməsi (+) - Sevimli
    else if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        toggleHeart(); // Yalnız heart toggle 
    }
});

// Orijinal event listener-lər
sound.addEventListener('click', speakAdvice);

heart.addEventListener('click', toggleHeart);

function myFunction(x) {
    const isFilled = x.classList.contains("fa-heart");
    
    if (isFilled) {
        x.classList.replace("fa-heart", "fa-heart-o");
    } else {
        x.classList.replace("fa-heart-o", "fa-heart");
    }
}

window.addEventListener('load', () => {
    getAdvice();
});

btn.addEventListener('click', () => {
    getAdvice();
});

// Geriyə uyğunluq üçün əvvəlki heart funksiyası
heart.addEventListener('click', () => {
    myFunction(heart.querySelector('i'));
});
