import AuthService from './auth.service';
export default function authHeader() {
    const user = AuthService.getLocalUser();

    if (user && user.accessToken) {
        // return { Authorization: 'Bearer ' + user.accessToken }; // for Spring Boot back-end
        return { 'x-access-token': user.accessToken }; // for Node.js Express back-end
    } else {
        return {};
    }
}