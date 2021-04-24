// Initialize focus to the "Name" input field
const nameInput = document.querySelector('#name');
nameInput.focus();

/***
 * Job Role Selection
***/
const jobInput = document.querySelector('#title');
const otherJobInput = document.querySelector('#other-job-role');
otherJobInput.style.display = 'none';

// Hide/show "Other" job role input field based on selection
jobInput.addEventListener('input', e => {
    e.target.value === 'other' ? otherJobInput.style.display = 'block' : 
                                 otherJobInput.style.display = 'none';
});

/***
 * T-Shirt Design/Color
***/
const designInput = document.querySelector('#design');
const colorInput = document.querySelector('#color');
const colorDiv = colorInput.parentNode;
const colors = colorInput.children;

// Initialize color selection as hidden
colorDiv.style.display = 'none';

// When a theme is selected, display related color options
designInput.addEventListener('input', e => {
    colorDiv.style.display = 'block';
    
    if(e.target.value === 'js puns')
    {
        colorInput.value = colors[0].value;

        for(let i = 1; i < colors.length; i++)
        {
            if(colors[i].dataset.theme === 'js puns')
            {
                colors[i].hidden = false;
            }
            else if(colors[i].dataset.theme === 'heart js')
            {
                colors[i].hidden = true;
            }
        }
    }
    else if (e.target.value === 'heart js')
    {
        colorInput.value = colors[0].value;

        for(let i = 1; i < colors.length; i++)
        {
            if(colors[i].dataset.theme === 'heart js')
            {
                colors[i].hidden = false;
            }
            else if(colors[i].dataset.theme === 'js puns')
            {
                colors[i].hidden = true;
            }
        }
    }
});

/*** 
 * Activity Registration and Accessibility
***/
const activities = document.querySelector('#activities');
const activitiesTotal = document.querySelector('#activities-cost');
let totalCost = 0;

// Update total cost of all activities based on selected input
activities.addEventListener('input', e => {
    activityChecked = e.target.checked;
    const activityCost = e.target.dataset.cost;

    activityChecked ? totalCost += parseInt(activityCost) : 
                      totalCost -= parseInt(activityCost);

    activitiesTotal.textContent = `Total: $${totalCost}`;
});


// Accessibility for keyboard navigation
activities.addEventListener('focusin', e => {
    const label = e.target.parentNode;
    label.className = 'focus';
});
activities.addEventListener('focusout', e => {
    const label = e.target.parentNode;
    label.className = '';
});

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

/*** 
 * Form Validation
 ***/
const form = document.querySelector('form');

// Add listeners to input fields to perform real-time validation
addListenersToField('name');
addListenersToField('email');
addListenersToField('cc-num');
addListenersToField('zip');
addListenersToField('cvv');

// Validate all form input on submit
form.addEventListener('submit', e => {
    // If any input is invalid, do not submit form
    if(!validateField('name'))
    {
        e.preventDefault();
    }

    if(!validateField('email'))
    {
        e.preventDefault();
    }

    if(!validateActivity())
    {
        e.preventDefault();
    }

    if(paymentSelect.value === 'credit-card')
    {
        if(!validateField('cc-num'))
        {
            e.preventDefault();
        }

        if(!validateField('zip'))
        {
            e.preventDefault();
        }

        if(!validateField('cvv'))
        {
            e.preventDefault();
        }
    }
    // Else submit form
});

// Validate input field
function validateField(field)
{
    const element = document.querySelector(`#${field}`);
    const label = element.parentNode;
    let hint = document.querySelector(`#${field}-hint`);
    let fieldIsValid = '';

    // Change validation regex based on input field
    switch(field)
    {
        case 'name':
            fieldIsValid = /^[a-zA-Z]+ ?[a-zA-Z]*? ?[a-zA-Z]*?$/.test(element.value);
        break;
        case 'email':
            fieldIsValid = /^[^@]+@[^@.]+\.[a-z]+$/i.test(element.value);
            if(!element.value)
                hint.textContent = 'Email address field cannot be empty';
            else
                hint.textContent = 'Email address must be formatted correctly';
        break;
        case 'cc-num':
            fieldIsValid = /^\d{4}\d{4}\d{4}\d{1,4}$/.test(element.value);
            hint = document.querySelector(`#cc-hint`); // Necessary because #cc-hint does not contain 'num'
            if(!element.value)
                hint.textContent = 'Credit card field cannot be empty';
            else
                hint.textContent = 'Credit card number must be between 13 - 16 digits';
        break;
        case 'zip':
            fieldIsValid = /^\d{5}$/.test(element.value);
            if(!element.value)
                hint.textContent = 'Zip code field cannot be empty';
            else
                hint.textContent = 'Zip Code must be 5 digits';
        break;
        case 'cvv':
            fieldIsValid = /^\d{3}$/.test(element.value);
            if(!element.value)
                hint.textContent = 'CVV field cannot be empty';
            else
                hint.textContent = 'CVV must be 3 digits';
        break;
    }

    // If field is not valid, flag user
    if(!fieldIsValid)
    {
        label.className = 'not-valid';
        hint.style.display = 'block';
        return false;
    }

    // If field is valid, submit
    label.className = 'valid';
    hint.style.display = 'none';
    return true;
}

// Function to add listeners to input fields to perform real-time validation
function addListenersToField(field)
{
    const element = document.querySelector(`#${field}`);

    // Flag user if the input field is invalid
    element.addEventListener('keyup', () => {
        validateField(field);
    });
}

// Validate activities don't share the same timeslot, and that at least one activity is checked
function validateActivity(event)
{
    const activityInputs = document.querySelectorAll('#activities input');
    const firstTimeSlots = [];
    const secondTimeSlots = [];
    let activityChecked = false;

    if(event) // is passed in
    {
        // Get a list of each timeslot
        for(let i = 0; i < activityInputs.length; i++)
        {
            const activityDate = activityInputs[i].nextElementSibling.nextElementSibling.textContent;
            const timeSlot = activityDate.replace(/\D/g, '');
            const activityDay = activityDate.replace(/\s\d+[a|p]m-\d+pm/gi, '');
            console.log(activityDay);
            
            if(timeSlot === '912' && activityDay !== 'Wednesday')
            {
                firstTimeSlots.push(activityInputs[i]);
            }
            else if(timeSlot === '14' && activityDay !== 'Wednesday')
            {
                secondTimeSlots.push(activityInputs[i]);
            }
        }
        
        const currentDate = event.target.nextElementSibling.nextElementSibling.textContent;
        const currentTimeSlot = currentDate.replace(/\D/g, '');
        const currentActivityDay = currentDate.replace(/\s\d+[a|p]m-\d+pm/gi, '');
    
        // Enable/disable activities with the same timeslot based on if the checkbox is checked or unchecked
        if(event.target.checked)
        {
            // Disable activities with the same timeslot as the target
            if(currentTimeSlot === '912' && currentActivityDay !== 'Wednesday')
            {
                for(let i = 0; i < firstTimeSlots.length; i++)
                {
                    if(firstTimeSlots[i] !== event.target)
                    {
                        const label = firstTimeSlots[i].parentNode;
                        firstTimeSlots[i].disabled = true;
                        label.className = 'disabled';
                    }
                }
            }
            else if(currentTimeSlot === '14' && currentActivityDay !== 'Wednesday')
            {
                for(let i = 0; i < secondTimeSlots.length; i++)
                {
                    if(secondTimeSlots[i] !== event.target)
                    {
                        const label = secondTimeSlots[i].parentNode;
                        secondTimeSlots[i].disabled = true;
                        label.className = 'disabled';
                    }
                }
            }
        }
        else if(!event.target.checked)
        {
            // Enable activities with the same timeslot as the target
            if(currentTimeSlot === '912' && currentActivityDay !== 'Wednesday')
            {
                for(let i = 0; i < firstTimeSlots.length; i++)
                {
                    if(firstTimeSlots[i] !== event.target)
                    {
                        const label = firstTimeSlots[i].parentNode;
                        firstTimeSlots[i].disabled = false;
                        label.className = '';
                    }
                }
            }
            else if (currentTimeSlot === '14' && currentActivityDay !== 'Wednesday')
            {
                for(let i = 0; i < secondTimeSlots.length; i++)
                {
                    if(secondTimeSlots[i] !== event.target)
                    {
                        const label = secondTimeSlots[i].parentNode;
                        secondTimeSlots[i].disabled = false;
                        label.className = '';
                    }
                }
            }
        }
    }

    // Loop through to see if any activities are checked
    for(let i = 0; i < activityInputs.length; i++)
    {
        activityInputs[i].checked ? activityChecked = true : activityChecked = false;

        if(activityChecked)
        {
            break;
        }
    }

    // Flag user if no activities are checked
    if(!activityChecked)
    {
        activities.className = 'activities not-valid';
        activities.lastElementChild.style.display = 'block';
        return false;
    }
    activities.className = 'activities valid';
    activities.lastElementChild.style.display = 'none';
    return true;
}

// Add listeners to Activity Registration fields to perform real-time validation
activities.addEventListener('focusin', () => {
    if(!validateActivity())
    {
        activities.className = 'activities';
        activities.lastElementChild.style.display = 'none';
    }
});
activities.addEventListener('focusout', () => {
    validateActivity();
});
activities.addEventListener('input', (e) => {
    validateActivity(e);
});