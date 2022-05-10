import { useAuth } from '../auth/use-auth';

const Profile = () => {
    const auth = useAuth();
    const user = auth.user;
    console.log(user);
    return (
        <div className="container">
            <header className="jumbotron">
                <h3>
                    <strong>{user.info.UserName}</strong> Profile
                </h3>
            </header>
            <p>
                <strong>Token:</strong> {user.accessToken.substring(0, 20)} ...{' '}
                {user.accessToken.substr(user.accessToken.length - 20)}
            </p>
            <p>
                <strong>Id:</strong> {user.info.AccountID}
            </p>
            <p>
                <strong>Email:</strong> {user.info.Email}
            </p>
            <strong>Role:</strong>
            <ul>{user.info.Role}</ul>
        </div>
    );
};

export default Profile;
