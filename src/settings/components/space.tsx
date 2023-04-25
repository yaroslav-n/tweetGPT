import styled from "styled-components";

export const Space = styled.div((props: { height: number }) => `
    height: ${props.height}px;
`);