import { Container } from "@mui/material";
import React from "react";
import Slider from "react-slick";

function SimpleSlider() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    return (
        <React.Fragment>
            <Container>
                <h2>Single Items Slider</h2>
                <Slider {...settings}>
                    <div>
                        <img src="https://images.unsplash.com/photo-1726828581304-1bd8a2b90246?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM3fGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3D" alt="" />
                    </div>
                    <div>
                        <img src="https://images.unsplash.com/photo-1726828581304-1bd8a2b90246?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM3fGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3D" alt="" />
                    </div>
                    <div>
                        <img src="https://images.unsplash.com/photo-1726828581304-1bd8a2b90246?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM3fGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3D" alt="" />
                    </div>
                    <div>
                        <img src="https://images.unsplash.com/photo-1726828581304-1bd8a2b90246?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM3fGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3D" alt="" />
                    </div>
                    <div>
                        <img src="https://images.unsplash.com/photo-1726828581304-1bd8a2b90246?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM3fGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3D" alt="" />
                    </div>
                    <div>
                        <img src="https://images.unsplash.com/photo-1726828581304-1bd8a2b90246?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM3fGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3D" alt="" />
                    </div>
                </Slider>
            </Container>
        </React.Fragment>
    );
}

export default SimpleSlider;
