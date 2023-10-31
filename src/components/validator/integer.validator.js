class IntegerValidator
{
    constructor(number) {
        this.number = number;
      }
      
    isValid() {
        return Number.isInteger(this.number);
    }
}

export default IntegerValidator;