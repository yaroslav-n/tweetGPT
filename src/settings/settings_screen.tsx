import * as React from 'react';
import { useMemo } from 'react';
import { Body, Container, H1, H2, Logo, SettingsBlock, Subtitle } from './settings_screen.styled';

export const SettingsScreen = () => {
    const logoPath = useMemo(() => chrome.runtime.getURL('icons/128.png'), []);

    return (
        <Body>
            <Logo src={logoPath} />
            <Container>
                <H1>TweetGPT Settings</H1>
                <SettingsBlock>
                    <H2>OpenAI API Token ⚠️</H2>
                    <Subtitle>Required. You can find your Secret API key in your <a href="https://platform.openai.com/account/api-keys">OpenAI User settings</a>.</Subtitle>
                    <input type="text" />
                </SettingsBlock>
                <SettingsBlock>
                <H2>Text Generation</H2>
                    <input type="checkbox" />
                    <input type="checkbox" />
                </SettingsBlock>
                <SettingsBlock>
                <H2>Language</H2>
                <input type="select" />
                </SettingsBlock>
            </Container>
        </Body>
    )
};