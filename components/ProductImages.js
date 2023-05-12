import { useState } from "react";
import styled from "styled-components"

const Image = styled.img`
        max-width: 100%;
        max-height: 100%;
    `;

const ImageButtons = styled.div`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 10px;
        flex-grow: 0;
        text-align: center;
    `;

const ImageButton = styled.div`
        border: 1px solid #aaa;
        ${props => props.active ? `
            border-color: #ccc;
        `: `
            border-color: transparent;
            opacity: .7;
        `}
        padding: 2px;
        cursor: pointer;
        border-radius: 5px;
    `;

const BigImage = styled.img`
    max-width: 100%;
    max-height: 200px;
`;

const BigImageWrapper = styled.div`
    text-align: center;
    margin-bottom: 20px;
`;

export default function ProductImages({ images }) {
    const [activeImage, setActiveImage] = useState(images?.[0].url);


    return (
        <>
            <BigImageWrapper>
                <BigImage src={activeImage} alt="" />
            </BigImageWrapper>
            <ImageButtons>
                {images.map(image => (
                    <ImageButton
                        key={image._id}
                        active={image?.url === activeImage}
                        onClick={() => setActiveImage(image?.url)}>
                        <Image src={image?.url} alt="" />
                    </ImageButton>
                ))}
            </ImageButtons>
        </>
    )
}