# interactive_form
 *An interactive registration form for a fictional Full Stack conference.

**Features**
 - Allows form users to register with required and optional fields
 - Dynamically changes form input fields based on user selection
 - Performs real-time validation on all input fields
 - Provides custom user error-messaging related to the associated validation

**Code Example**
 The following is a JS code-snippet of allowing the user to dynamically switch between different payment methods, and displaying/hiding the associated input fields relative to the selected payment method.
```
/*** 
 * Payment Information
***/
const paymentMethods = document.querySelectorAll('.payment-methods > div');
const paymentSelect = document.querySelector('#payment');

// Initialize payment method select as 'Credit Card'
paymentSelect.selectedIndex = '1';

// Initialize other payment method divs as hidden
for(let i = 2; i < paymentMethods.length; i++)
{
    paymentMethods[i].style.display = 'none';
}

// Change payment method based on selected input
paymentSelect.addEventListener('input', e => {
    const method = e.target.value;
    
    for(let i = 1; i < paymentSelect.length; i++)
    {
        method !== paymentMethods[i].id ? paymentMethods[i].style.display = 'none' :
        paymentMethods[i].style.display = 'block';
    }
});
```

**Custom Error Messaging**
 Users will get more specific error-messaging based on the validation effort.
 For example, if the email field is blank, the user will receive an error-message describing that.
 However, if it's not blank but formatted incorrectly, they will receive a different error-message.
```
if(!element.value)
    hint.textContent = 'Email address field cannot be empty';
else
    hint.textContent = 'Email address must be formatted correctly';
```
Finally, the user will be notified that the field is correctly formatted if it passes validation.

**How to use?**  
 You can preview what the code does by downloading the project and opening index.html.