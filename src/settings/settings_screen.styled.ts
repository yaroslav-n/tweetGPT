import styled from 'styled-components';

export const Body =  styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 50px;
    background-color: #F7F9F9;
    font-family: 'Roboto', sans-serif;
    box-sizing: border-box;
`;

export const Container = styled.div`
    width: 600px;
    padding: 35px 25px;
    border-radius: 10px;
    background-color: white;
    display: flex;
    flex-direction: column;
`;

export const H1 = styled.h1`
    font-size: 25px;
    font-weight: bold;
    color: #181C21;
    margin: 0;
`;

export const H2 = styled.h2`
    font-size: 18px;
    font-weight: 600;
    color: #181C21;
    margin: 0;
`

export const Subtitle = styled.span`
    font-size: 15px;
    color: #566370;

    a {
        color: #566370;
    }
`

export const Logo = styled.img`
    width: 80px;
    height: 80px;
    margin-bottom: 25px;
`;

export const SettingsBlock = styled.div`
    width: 100%;
    margin-top: 25px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
`;

export const TextInput = styled.input`
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    padding: 0 10px;
    background: #FFFFFF;
    border: 1px solid #D1D9DD;
    color: #181C21;
    font-size: 15px;
    border-radius: 5px;

    ::placeholder {
        color: #D1D9DD;
    }
`;

export const Space = styled.div((props: { height: number }) => `
    height: ${props.height}px;
`);