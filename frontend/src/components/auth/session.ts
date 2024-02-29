/**
 * Represents a user session object.
 * @class
 * @author Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk)
 */
export class Session {

    private _cookie: SessionCookie | undefined;
    private _role: Role | undefined;
    private _firstName: string | undefined;
    private _lastName: string | undefined;
    private _email: string | undefined;
    private _sessionId: string | undefined;

    constructor(params?: ConstructorParams) {
        if (params?.cookie !== undefined) {
            this.cookie = params.cookie;
        }
    }

    /**
     * Get the session id.
     */
    get sessionId(): string | undefined {
        return this._sessionId;
    }

    /**
     * Set the session id.
     * @param value
     */
    set sessionId(value: string | undefined) {
        this._sessionId = value;
    }

    /**
     * Get the email.
     */
    get email(): string | undefined {
        return this._email;
    }

    /**
     * Set the email.
     * @param value
     */
    set email(value: string | undefined) {
        this._email = value;
    }

    /**
     * Get the last name.
     */
    get lastName(): string | undefined {
        return this._lastName;
    }

    /**
     * Set the last name.
     * @param value
     */
    set lastName(value: string | undefined) {
        this._lastName = value;
    }

    /**
     * Gets the first name.
     */
    get firstName(): string | undefined {
        return this._firstName;
    }

    /**
     * Sets the first name.
     * @param value
     */
    set firstName(value: string | undefined) {
        this._firstName = value;
    }

    /**
     * Gets the session role.
     */
    get role(): Role | undefined {
        return this._role;
    }

    /**
     * Sets the session role.
     * @param value
     */
    set role(value: Role | undefined) {
        this._role = value;
    }

    get cookie(): SessionCookie | undefined {
        return this._cookie;
    }

    set cookie(value: SessionCookie) {
        this._cookie = value;
        this._role = value.role;
        this._firstName = value.firstName;
        this._lastName = value.lastName;
        this._email = value.email;
        this._sessionId = value.sessionId;
    }

    /**
     * Return a JSON object representing the session.
     */
    get json() {
        return {
           role: this._role,
           firstName: this._firstName,
           lastName: this._lastName,
           email: this._email,
           sessionId: this._sessionId
        }
    }

    /**
     * Converts session object to a string that can be stored in a cookie.
     * @return {string} The session object as a string.
     */
    toString(): string {
        return JSON.stringify(this.json);
    }
}

/**
 * The params required by the constructor.
 */
interface ConstructorParams {
    cookie?: SessionCookie
}

/**
 * All possible session roles.
 */
type Role = 'waiter' | 'kitchen' | 'customer';

/**
 * The format of the cookie stored in the browser.
 */
type SessionCookie = {
    role: Role,
    firstName: string,
    lastName: string,
    email: string,
    sessionId: string
};