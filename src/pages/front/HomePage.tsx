import React from 'react';

import HeroSection from '../../components/front/HeroSection';
import AboutSection from '../../components/front/AboutSection';
import ServiceSection from '../../components/front/ServiceSesction';
import TutorielSection from '../../components/front/TutorielSection';
import TestimonialSection from '../../components/front/TestimonialSection';
import { Spinner } from '../../components/front/Spinner';

const HomePage = () => {
    return(
        <div>
            <Spinner />
            <HeroSection />
            <AboutSection />
            <ServiceSection />
            <TutorielSection />
            <TestimonialSection />
        </div>
    )
}

export default HomePage;