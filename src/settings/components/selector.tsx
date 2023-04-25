import * as React from 'react';
import { FC } from "react";
import styled from 'styled-components';

export type languageOption = {
    value: string;
    label: string;
}

type Props = {
    value: string;
    onChange: (newVal: string) => void;
    options: languageOption[];
};

export const Selector: FC<Props> = ({ value, onChange, options }) => {
    return (
        <Container>
            <Select value={value} onChange={e => onChange(e.target.value)}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </Select>
        </Container>
    )
};

const Container = styled.div`
    border: 1px solid #ccc;
    border-radius: 3px;
    padding-right: 10px;
    width: 100%;
`;

const Select = styled.select`
    border-radius: 3px;
    border-width: 0;
    padding: 7px 10px;
    font-size: 15px;
    font-family: 'Roboto', sans-serif;
    color: #333;
    cursor: pointer;
    outline: none;
    width: 100%;
    box-sizing: border-box;
`;