const validator = require(validator);

const validateSignUpdata = (req)=>{
    const {firstName,lastName,emailId,password} = req.body;

    if(!firstName || !lastNmae){
        throw new Error("Nmae is not valid");
    }

    if(!validator.isEmail(emailId)){
        throw new Error("Invalid Email");
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password");
    }

}

model.exports = validateSignUpdata;