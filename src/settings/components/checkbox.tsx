import * as React from 'react';
import { FC } from "react";
import styled from "styled-components";

type Props = {
    value: boolean;
    label: string;
    onChange: (newVal: boolean) => void;
}

const icons = {
    checked: chrome.runtime.getURL("assets/checked.svg"),
    uncheked: chrome.runtime.getURL("assets/unchecked.svg"),
};

export const Checkbox: FC<Props> = ({ value, label, onChange}) => {
    const src = value && icons.checked || icons.uncheked;

    return (
        <Container onClick={() => onChange(!value)}>
            <div className='iconContainer'>
                <Icon src={src} />
                <CheckboxSquare type="checkbox" name={label} checked={value}/>
            </div>
            <Label htmlFor={label}>{label}</Label>
        </Container>
    )
}

const Container = styled.div`
    cursor: pointer;

    .iconContainer {
        /* padding: 10px; */
        border-radius: 3px;
        float:left;
        position: relative;
    }

    &:hover {
        .iconContainer {
            outline: 5px solid rgba(0,0,0,0.07);
        }
    }
`

const CheckboxSquare = styled.input`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: pointer;
`

const Icon = styled.img`
    width: 18px;
    height: 18px;
`


const Label = styled.label`
    margin-left: 10px;
    font-size: 15px;
    cursor: pointer;
    color: #181C21;
    user-select: none;
`