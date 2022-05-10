import { useEffect, useState } from 'react';

const BoardAdmin = () => {
    const [content, setContent] = useState('');

    useEffect(() => {
        // UserService.getAdminBoard().then(
        //     (response) => {
        //         setContent(response.data);
        //     },
        //     (error) => {
        //         const _content =
        //             (error.response && error.response.data && error.response.data.message) ||
        //             error.message ||
        //             error.toString();
        //         setContent(_content);
        //         if (error.response && error.response.status === 401) {
        //             console.log('unauth');
        //         }
        //     }
        // );
    }, []);

    return (
        <div className="container">
            <header className="jumbotron">
                <h3>Admin</h3>
            </header>
        </div>
    );
};

export default BoardAdmin;
