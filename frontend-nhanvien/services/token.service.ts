export class TokenService {
	constructor(
		private readonly _accessTokenName = 'app:token:access',
		private _accessToken: string = '',
	) {
		if (typeof window !== 'undefined') this._accessToken = localStorage.getItem(this._accessTokenName) || '';
	}

	get accessToken() {
		return this._accessToken;
	}

	set accessToken(token: string) {
		this._accessToken = token;
		if (typeof window !== 'undefined') localStorage.setItem(this._accessTokenName, token);
	}

	removeAccessToken() {
		this._accessToken = '';
		if (typeof window !== 'undefined') localStorage.removeItem(this._accessTokenName);
	}

	get authorization() {
		return `Bearer ${this.accessToken}`;
	}

	get isAuthorized() {
		return !!this.accessToken;
	}
}

export default new TokenService() as TokenService;