import emailValidator from  'deep-email-validator';

class EmailValidator
{
    constructor(email) {
        this.email = email;
      }
      
    isValid() {
        return emailValidator.validate(this.email);
    }
}

export default EmailValidator;