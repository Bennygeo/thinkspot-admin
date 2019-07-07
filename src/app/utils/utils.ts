export class Utils {
}

export class UserDetails {
    name: string;
    email: string;
    mobile: string;
    address: string;
    area: string;
    history: OrderDetails;
    mobileNo: number;
    constructor(

    ) { }
}

export class OrderDetails {
    start: string;
    end: string;
    quantity: number;
    straw: boolean;
    price: number;
    constructor(
    ) { }
}

export class Globals {
    constructor() {

    }

    public static Places: Places[] = [
        { value: 'Nandambakkam', viewValue: 'Nandambakkam' },
        { value: 'Kattupakkam', viewValue: 'Kattupakkam' },
        { value: 'Mogappair', viewValue: 'Mogappair' },
        { value: 'Porur', viewValue: 'Porur' },
        { value: 'Mugalivakkam', viewValue: 'Mugalivakkam' },
        { value: 'Nolambur', viewValue: 'Nolambur' },
        { value: 'Other', viewValue: 'Other' }
    ];

    public static account_validation_messages: any = {
        'username': [
            { type: 'required', message: 'Username is required' },
            { type: 'minlength', message: 'Username must be at least 5 characters long' },
            { type: 'maxlength', message: 'Username cannot be more than 25 characters long' },
            { type: 'pattern', message: 'Your username must contain only numbers and letters' },
        ],
        'email': [
            { type: 'required', message: 'Email is required' },
            { type: 'pattern', message: 'Enter a valid email' }
        ]
    }
}

export class Places {
    value: string;
    viewValue: string;
}



