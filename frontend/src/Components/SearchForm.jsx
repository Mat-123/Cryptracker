import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchForm() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [userWallet, setUserWallet] = useState([]);

useEffect(() => {
    const fetchUserWallet = async () => {
        try {
            const response = await fetch('/api/v1/wallet');
            const data = await response.json();
            setUserWallet(data);
        } catch (error) {
            setError('Error, please try again later');
        }
    };

    fetchUserWallet();
}, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!query) {
            setError('Inserisci una query di ricerca.');
            return;
        }

        setError('');


        fetch(`/api/v1/crypto?query=${query}`)
            .then((response) => response.json())
            .then((data) => {
                navigate('/results', { state: { results: data.data, userWallet } });
            })
            .catch((error) => {
                console.error('Errore nella ricerca:', error);
                navigate('/results', { state: { results: [] } });
            });
    };

    return (
        <>
    <div className="col-2">

    </div>
    <div className="col-8">
        <div className="card card-bg-color rounded-4 text-white mt-5">
            <div className="card-body">
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="form-group mt-5">
                <input
                    type="text"
                    className="form-control card-bg-color text-white"
                    placeholder="Search crypto..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {error && <div className="text-danger mt-2">{error}</div>}
            </div>
            <button type="submit" className="btn manage-btn mt-3">Search</button>
        </form>
        </div>
        </div>
        </div>
        </>
    );
}

export default SearchForm;
