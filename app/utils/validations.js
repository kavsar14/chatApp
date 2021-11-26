export const validateEmail= (email) => {
    let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(email == ''){
        return 'Email Id cannot be empty';
    } else if (!regex.test(email)) {
        return 'Are you sure you entered the valid email?';
    } else {
        return '';
    }
}

export const validatePassword = (password) => {
    if(password == ''){
        return 'Password cannot be empty';
    } else if(password.length < 6){
        return 'Password must be minimum 6 characters long';
    } else {
        return '';
    }
}

export const validateMobile = (mobile) => {
    let regex = /^\d{10,13}$/;
    if(!regex.test(mobile)){
        return 'Phone number must be between 10 to 13 digits';
    } else {
        return '';
    }
}

export const validateName = (name) => {
    let regex = /^[a-zA-Z0-9]+$/;
    if(!regex.test(name)){
        return 'This field can only contain “Alphanumeric” values. Please try again.';
    } else {
        return '';
    }
}