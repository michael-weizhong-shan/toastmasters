const timeLimits = {
    "roleSpeechIntro": 120,
    "welcomeSpeech": 180,
    "standardSpeech": 420,
    "evaluation": 180,
    "tableTopicsEvaluation": 360,
    "tableTopics": 120,
    "roleReports": 180,
    "generalEvaluatorReport": 300,
}

var countdownInterval;
var countUpInterval;
var role;
var minutes;
var seconds;
var customTimeLimit;
var greenLightTime;
var yellowLightTime;

// Define a variable to store the state of the timer
var isPaused = false;

// Define a variable to store the direction of the timer
var isCountingUp = false;

// Check if the input is a valid number
function isNumberKey(evt){
var charCode = (evt.which) ? evt.which : evt.keyCode
return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

// Validate the input seoconds to make sure it is within the range
function validateInput(input) {
var min = 0; 
var max = 60;
var value = parseInt(input.value, 10);

if (value < min) {
    input.value = min;
} else if (value > max) {
    input.value = max;
}
}

function initializeVariables() {
// Reinitialize all global variables
minutes = 0;
seconds = 0;
greenLightTime = 0;
yellowLightTime = 0;
customTimeLimit = 0;
isPaused = false;
isCountingUp = false;

// Clear any existing intervals
if (countdownInterval) {
    clearInterval(countdownInterval);
}
if (countUpInterval) {
    clearInterval(countUpInterval);
}
}

function countDown() {
// Decrease the seconds
seconds--;

// If the seconds have run out
if (seconds < 0) {
    // Decrease the minutes
    minutes--;

    // If the minutes have run out
    if (minutes < 0) {
        // Reset the minutes and seconds to 0
        minutes = 0;
        seconds = 0;

        // Stop the countdown
        clearInterval(countdownInterval);

        // Start counting up
        isCountingUp = true;
        countUp();
        countUpInterval = setInterval(countUp, 1000);
        return;
    } else {
        // Reset the seconds to 59
        seconds = 59;
    }
}

// Update the timer display
updateTimerDisplay();

// Update the timer color
updateTimerColor();
}

function countUp() {
seconds++;
if (seconds >= 60) {
    minutes++;
    seconds = 0;
}

// Update the timer display
updateTimerDisplay();
}

function updateTimerDisplay() {
var minutesString = minutes < 10 ? '0' + minutes : minutes.toString();
var secondsString = seconds < 10 ? '0' + seconds : seconds.toString();
document.getElementById('timer').textContent = minutesString + ':' + secondsString;
}

function updateTimerColor() {
if (minutes === 0 && seconds === 0) {
    document.getElementById('timer').style.backgroundColor = 'red';
} else if (['standardSpeech', 'tableTopicsEvaluation', 'generalEvaluatorReport'].includes(role)) {
    if (minutes === 2 && seconds === 0) {
        document.getElementById('timer').style.backgroundColor = 'green';
    } else if (minutes === 1 && seconds === 0) {
        document.getElementById('timer').style.backgroundColor = 'yellow';
    }
} else if (role === 'custom') {
    // Change the color based on greenLightTime and yellowLightTime
    var totalSeconds = minutes * 60 + seconds;
    if (totalSeconds === greenLightTime) {
        document.getElementById('timer').style.backgroundColor = 'green';
    } else if (totalSeconds === yellowLightTime) {
        document.getElementById('timer').style.backgroundColor = 'yellow';
    }
} else {
    if (minutes === 1 && seconds === 0) {
        document.getElementById('timer').style.backgroundColor = 'green';
    } else if (minutes === 0 && seconds === 30) {
        document.getElementById('timer').style.backgroundColor = 'yellow';
    }
}
}

document.getElementById('pauseButton').addEventListener('click', function() {
if (isPaused) {
    // If the timer is paused, resume it in the correct direction
    countdownInterval = setInterval(isCountingUp ? countUp : countDown, 1000);
    this.textContent = 'Pause';
    isPaused = false;
} else {
    // If the timer is running, pause it
    clearInterval(countdownInterval);
    clearInterval(countUpInterval);
    this.textContent = 'Resume';
    isPaused = true;
}
});

document.getElementById('startButton').addEventListener('click', function() {
// Hide the config-timer layer
document.getElementById('config-timer').style.display = 'none';

// Show the display-timer layer
document.getElementById('about-timer').style.display = 'none';
document.getElementById('display-timer').style.display = 'block';

initializeVariables();

// Get the selected role
role = document.getElementById('role').value;

// Get the dropdown box
var dropdown = document.getElementById('role');

// Check if the dropdown value is "Custom"
if (dropdown.value === "custom") {
    // Get the input fields
    var customTimeLimitMinuteInput = document.getElementById('customTimeLimitMinute');
    var customTimeLimitSecondInput = document.getElementById('customTimeLimitSecond');
    var greenLightTimeBeforeLimitMinuteInput = document.getElementById('greenLightTimeMinute');
    var greenLightTimeBeforeLimitSecondInput = document.getElementById('greenLightTimeSecond');
    var yellowLightTimeBeforeLimitMinuteInput = document.getElementById('yellowLightTimeMinute');
    var yellowLightTimeBeforeLimitSecondInput = document.getElementById('yellowLightTimeSecond');

    // Parse the input values, or use 0 if they are not valid numbers
    var customTimeLimitMinute = parseInt(customTimeLimitMinuteInput.value) || 0;
    var customTimeLimitSecond = parseInt(customTimeLimitSecondInput.value) || 0;
    var greenLightTimeBeforeLimitMinute = parseInt(greenLightTimeBeforeLimitMinuteInput.value) || 0;
    var greenLightTimeBeforeLimitSecond = parseInt(greenLightTimeBeforeLimitSecondInput.value) || 0;
    var yellowLightTimeBeforeLimitMinute = parseInt(yellowLightTimeBeforeLimitMinuteInput.value) || 0;
    var yellowLightTimeBeforeLimitSecond = parseInt(yellowLightTimeBeforeLimitSecondInput.value) || 0;

    // Convert the input values to seconds and assign them to the variables
    customTimeLimit = customTimeLimitMinute * 60 + customTimeLimitSecond;
    greenLightTime = greenLightTimeBeforeLimitMinute * 60 + greenLightTimeBeforeLimitSecond;
    yellowLightTime = yellowLightTimeBeforeLimitMinute * 60 + yellowLightTimeBeforeLimitSecond;

    // Initialize the timer with the custom time limit
    minutes = customTimeLimitMinute;
    seconds = customTimeLimitSecond;
} else {
    // Use the regular settings from the dropdown box
    var timeLimit = timeLimits[role];
    minutes = Math.floor(timeLimit / 60);
    seconds = timeLimit % 60;
}

// Update the timer display
updateTimerDisplay();

// Start the countdown
countdownInterval = setInterval(countDown, 1000);

// Update the timer color
updateTimerColor();

// Update the text of the pause button
document.getElementById('pauseButton').textContent = 'Pause';
});

document.getElementById('resetButton').addEventListener('click', function() {
// Clear the interval
clearInterval(countdownInterval);

// Reinitialize the variables
initializeVariables();

// Clear the background color
document.getElementById('timer').style.backgroundColor = '';

// Reset the timer display
document.getElementById('timer').textContent = '00:00';

// Show and hide the appropriate elements
document.getElementById('pauseButton').textContent = 'Pause';

document.getElementById('display-timer').style.display = 'none';
document.getElementById('about-timer').style.display = 'none';
document.getElementById('config-timer').style.display = 'block';            
});

document.getElementById('role').addEventListener('change', function() {
if (this.value === 'custom') {
    document.getElementById('customTimeInput').style.display = 'block';
} else {
    document.getElementById('customTimeInput').style.display = 'none';
}
});  

// Trigger the change event when the page loads
window.onload = function() {
var event = new Event('change');
document.getElementById('role').dispatchEvent(event);
};

document.getElementById('aboutButton').addEventListener('click', function() {
// Hide other layers
document.getElementById('config-timer').style.display = 'none';
document.getElementById('display-timer').style.display = 'none';

// Show the about-timer layer
document.getElementById('about-timer').style.display = 'block';
});

document.getElementById('backButton').addEventListener('click', function() {
// Hide the current layer
document.getElementById('display-timer').style.display = 'none';
document.getElementById('about-timer').style.display = 'none';

// Show the config-timer layer
document.getElementById('config-timer').style.display = 'block';
});

// Register the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    })
}