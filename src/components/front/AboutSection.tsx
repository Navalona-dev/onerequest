import React from 'react';

import useInView from '../../hooks/useInView';

import About1 from '../../assets/images/about-1.png';
import About2 from '../../assets/images/about-2.png';

const AboutSection = () => {
    const [leftRef, leftVisible] = useInView();
    const [rightRef, rightVisible] = useInView();
    
    return(
        <div className="py-20 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Left Side - Images */}
                <div className="flex-1 flex flex-row sm:flex-col gap-4 h-full">
                    <div
                        ref={leftRef}
                        className={`w-1/2 self-start transition-all duration-1000 ${
                        leftVisible ? "animate-fadeInUp" : "opacity-0 translate-y-24"
                        }`}
                    >
                        <img src={About1} alt="About 1" className="w-full h-auto rounded-lg shadow-md" />
                    </div>
                    <div
                        ref={rightRef}
                        className={`w-1/2 self-end transition-all duration-1000 about-image-two ${
                        rightVisible ? "animate-fadeInDown" : "opacity-0 -translate-y-24"
                        }`}
                    >
                        <img src={About2} alt="About 2" className="w-full h-auto rounded-lg shadow-md" />
                    </div>
                </div>


                {/* Right Side - Content */}
                <div className="flex-1 space-y-6 animate-fadeIn delay-500">
                <p className="text-sm font-semibold uppercase text-red-500">À propos de nous</p>
                <h1 className="text-4xl md:text-5xl text-[#111C44] font-bold">We Are Leader In Industrial Market</h1>
                <p className="text-gray-600">
                    Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos.
                    Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet.
                </p>

                <div className="flex items-center gap-6 bg-gray-50 p-6 rounded-lg shadow">
                    <div className="bg-red-500 text-white text-center px-6 py-9">
                        <h1 className="text-5xl font-bold text-[#111C44]">25</h1>
                        <p className="text-lg">Years of</p>
                        <p className="text-lg">Experience</p>
                    </div>
                    <div className="space-y-2">
                    <p><i className="bi bi-check-all mr-2 text-red-500 text-xl"></i>Power & Energy</p>
                    <p><i className="bi bi-check-all mr-2 text-red-500 text-xl"></i>Civil Engineering</p>
                    <p><i className="bi bi-check-all mr-2 text-red-500 text-xl"></i>Chemical Engineering</p>
                    <p><i className="bi bi-check-all mr-2 text-red-500 text-xl"></i>Mechanical Engineering</p>
                    <p><i className="bi bi-check-all mr-2 text-red-500 text-xl"></i>Oil & Gas Engineering</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    <div className="flex items-center gap-4">
                    <div className="bg-red-500 rounded-full w-14 h-14 flex items-center justify-center">
                        <i className="bi bi-envelope-open-fill text-white text-xl"></i>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Email us</p>
                        <h5 className="text-lg font-semibold">info@example.com</h5>
                    </div>
                    </div>
                    <div className="flex items-center gap-4">
                    <div className="bg-red-500 rounded-full w-14 h-14 flex items-center justify-center">
                        <i className="bi bi-telephone-fill text-white text-xl"></i>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Call us</p>
                        <h5 className="text-lg font-semibold">+012 345 6789</h5>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>

    )
}

export default AboutSection;