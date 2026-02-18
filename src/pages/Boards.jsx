import Logout from "../components/Logout"

function Boards(){
    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 pt-20 pb-24">
                <h1>If you are seeing this then the Login flow is working correctly</h1>
                <Logout/>
            </div>
            
        </div>
    )
}

export default Boards