class PasswordValidator
{
    constructor(value) {
        this.value = value;
      }
      
    isValid() {
        return typeof this.value === 'string' && this.value.length >= 6;
    }
}

export default PasswordValidator;