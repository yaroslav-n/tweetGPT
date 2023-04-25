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
