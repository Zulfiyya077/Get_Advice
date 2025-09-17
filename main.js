let advice = document.querySelector('.advice');
let id = document.querySelector('.idnum');
let btn = document.querySelector('.btn');
let sound = document.querySelector('.sound');
let heart = document.querySelector('.heart');
const url = 'https://api.adviceslip.com/advice';

// Mobile device detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroid = /Android/i.test(navigator.userAgent);

let voices = [];
let voicesLoaded = false;

// Load voices for mobile devices
function loadVoices() {
    voices = speechSynthesis.getVoices();
    voicesLoaded = true;
}

// iOS specific voice loading
if (isIOS) {
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    loadVoices();
}

// Android specific voice loading
if (isAndroid) {
    setTimeout(loadVoices, 100);
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
}

let getAdvice = () => {
    fetch(url).then((data) => data.json()).then((item) => {
        advice.innerHTML = item.slip.advice;
        id.innerHTML = item.slip.id;
    }).catch((error) => {
        console.log(error);
    });
};

// Enhanced speech function for mobile
function speakText(text) {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
        alert('Bu cihazda səs dəstəyi mövcud deyil');
        return;
    }

    // Stop any ongoing speech
    speechSynthesis.cancel();

    // Wait a bit for cancel to complete
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // iOS specific settings
        if (isIOS) {
            utterance.rate = 0.7;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            // Use first available voice for iOS
            if (voices.length > 0) {
                utterance.voice = voices.find(voice => voice.lang.includes('en')) || voices[0];
            }
            
            // iOS requires immediate speech after user interaction
            speechSynthesis.speak(utterance);
        }
        
        // Android specific settings
        else if (isAndroid) {
            utterance.rate = 0.8;
            utterance.pitch = 1.1;
            utterance.volume = 1.0;
            
            // Find English voice for Android
            if (voices.length > 0) {
                const englishVoice = voices.find(voice => 
                    voice.lang.includes('en-US') || voice.lang.includes('en')
                );
                if (englishVoice) {
                    utterance.voice = englishVoice;
                }
            }
            
            speechSynthesis.speak(utterance);
        }
        
        // Desktop/Other devices
        else {
            utterance.rate = 0.8;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            speechSynthesis.speak(utterance);
        }

        // Error handling
        utterance.onerror = function(event) {
            console.error('Speech synthesis error:', event.error);
            if (isMobile) {
                alert('Səs oynatılarkən xəta baş verdi');
            }
        };

        // Success callback
        utterance.onend = function() {
            console.log('Speech completed');
        };

    }, 100);
}

// Enhanced sound event listener
sound.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent any default behavior
    
    const textToSpeak = advice.innerHTML.replace(/<[^>]*>/g, ''); // Remove HTML tags
    
    if (!textToSpeak.trim()) {
        alert('Oxunacaq mətn yoxdur');
        return;
    }

    // Mobile specific handling
    if (isMobile) {
        // Ensure voices are loaded
        if (!voicesLoaded) {
            loadVoices();
            setTimeout(() => speakText(textToSpeak), 200);
        } else {
            speakText(textToSpeak);
        }
    } else {
        // Desktop handling
        speakText(textToSpeak);
    }
});

// Heart function
function myFunction(x) {
    const isFilled = x.classList.contains("fa-heart");
    
    if (isFilled) {
        x.classList.replace("fa-heart", "fa-heart-o");
    } else {
        x.classList.replace("fa-heart-o", "fa-heart");
    }
}

// Event listeners
window.addEventListener('load', () => {
    getAdvice();
    
    // Load voices on page load for mobile
    if (isMobile) {
        setTimeout(loadVoices, 500);
    }
});

btn.addEventListener('click', () => {
    getAdvice();
});

heart.addEventListener('click', () => {
    myFunction(heart.querySelector('i'));
});

// Additional mobile-specific fixes
if (isMobile) {
    // Prevent double-tap zoom on buttons
    sound.addEventListener('touchend', (e) => {
        e.preventDefault();
    });
    
    // Resume audio context on iOS if needed
    if (isIOS) {
        document.addEventListener('touchstart', function() {
            if (speechSynthesis.paused) {
                speechSynthesis.resume();
            }
        }, { once: true });
    }
}
