// Handle Google Sign-In
function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    const id_token = googleUser.getAuthResponse().id_token;
    sendTokenToBackend(id_token, 'google');
}

document.getElementById('google-signin-btn').onclick = function() {
    gapi.auth2.getAuthInstance().signIn();
};

// Handle Facebook Sign-In
window.fbAsyncInit = function() {
    FB.init({
        appId: 'YOUR_APP_ID',
        cookie: true,
        xfbml: true,
        version: 'v16.0'
    });

    document.getElementById('facebook-signin-btn').onclick = function() {
        FB.login(function(response) {
            if (response.authResponse) {
                const accessToken = response.authResponse.accessToken;
                sendTokenToBackend(accessToken, 'facebook');
            } else {
                alert('User cancelled login or failed.');
            }
        }, {scope: 'email'});
    };
};

// Handle OTP via Phone
function showPhoneLogin() {
    document.getElementById('phone-login').style.display = 'block';
}

function sendOTP() {
    const phoneNumber = document.getElementById('phone-number').value;
    if (phoneNumber) {
        fetch('http://localhost:3000/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone: phoneNumber }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                document.getElementById('otp-code').style.display = 'block';
                document.getElementById('verify-otp-btn').style.display = 'block';
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert('Please enter your phone number.');
    }
}

function verifyOTP() {
    const phoneNumber = document.getElementById('phone-number').value;
    const otpCode = document.getElementById('otp-code').value;

    fetch('http://localhost:3000/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber, otp: otpCode }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('isSignedIn', 'true');
            alert('OTP verified! You are now signed in.');
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function sendTokenToBackend(token, provider) {
    fetch('http://localhost:3000/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, provider }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('isSignedIn', 'true');
            alert('You are now signed in!');
        } else {
            alert('Authentication failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
