import React from 'react';
import Lottie from "react-lottie";
import animationData from "../assets/animations/ComingSoon.json";

const ComingSoonComponent = () => {
    const defaultOptions = {
        animationData
    };

    return <div>
        <Lottie
            width={1100}
            height={450}
            speed={1}
            options={defaultOptions}
        />
    </div>;
}

export default ComingSoonComponent;