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
        console.log( error);

    });
};

sound.addEventListener('click', () => {
    let text = advice.innerHTML.trim();
    if (text) {
        let utterance = new SpeechSynthesisUtterance(text);
        // Dil təyin et (məsələn, Azərbaycan üçün yaxın olan türk dili)
        utterance.lang = "tr-TR";
        // İngilis mətnlər üçün:
        // utterance.lang = "en-US";
        // Mobil Chrome üçün workaround
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        speechSynthesis.resume(); // bəzi mobil cihazlarda lazımdır
        speechSynthesis.speak(utterance);
    }
});

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

heart.addEventListener('click', () => {
    myFunction(heart);
});
