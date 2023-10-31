class NumberValidator
{
    constructor(value) {
        this.value = value;
      }
      
    isValid() {
        return typeof this.value === 'number'
    }
}

export default NumberValidator;