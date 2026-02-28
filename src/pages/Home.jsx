import { Link } from "react-router-dom"
import backgroundImage from "../assets/bg-1.jpg"

function Home() {
   return (
    <div className="min-h-screen">
        {/* Hero */}
        <div 
            className="text-white bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="container mx-auto px-4 pt-14 pb-16 sm:pt-20 sm:pb-24 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <div className="flex-1 space-y-5 text-center md:text-left">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                            Capture.<br />
                            Organize.<br />
                            <span className="text-header">Complete.</span>
                        </h1>
                        <p className="text-lg text-white max-w-md leading-relaxed mx-auto md:mx-0">
                            Break free from the mess and disorder—boost your efficiency using KanbanStack
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center md:justify-start">
                            <Link to="/login">
                                <button className="w-full sm:w-auto px-8 py-4 bg-btn text-black font-semibold rounded-lg hover:bg-btnHover transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
                                    Start Organizing
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>




    </div>
)
}

export default Home;