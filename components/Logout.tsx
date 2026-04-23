import { doGoogleLogout } from "../app/actions/index.js"

// need to add button styling

const Logout = () => {
    return (
        <form action={doGoogleLogout}>
            <button 
                type="submit" 
                className=""
                >
                    Logout
            </button>
        </form>
    )
}

export default Logout;