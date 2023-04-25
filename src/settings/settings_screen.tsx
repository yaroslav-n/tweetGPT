import * as React from 'react';
import { useMemo } from 'react';
import { Body, Container, H1, H2, Logo, SettingsBlock, Space, Subtitle, TextInput } from './settings_screen.styled';
import { Checkbox } from './components/CheckBox';
import { Selector } from './components/selector';

export const SettingsScreen = () => {
    const logoPath = useMemo(() => chrome.runtime.getURL('icons/128.png'), []);

    return (
        <Body>
            <Logo src={logoPath} />
            <Container>
                <H1>TweetGPT Settings</H1>
                <SettingsBlock>
                    <H2>OpenAI API Token ⚠️</H2>
                    <Space height={3} />
                    <Subtitle>Required. You can find your Secret API key in your <a href="https://platform.openai.com/account/api-keys">OpenAI User settings</a>.</Subtitle>
                    <Space height={10} />
                    <TextInput type="text" placeholder='Put your secret API token here'/>
                </SettingsBlock>
                <SettingsBlock>
                    <H2>Text Generation</H2>
                    <Space height={10} />
                    <Checkbox value={true} onChange={() => {}} label='Add TweetGPT Signature' />
                    <Space height={10} />
                    <Checkbox value={false} onChange={() => {}} label='Ask for tweet topic in replies' />
                </SettingsBlock>
                <SettingsBlock>
                    <H2>Language</H2>
                    <Space height={10} />
                    <Selector value='en' onChange={() => {}} options={[{value: 'en', label: 'English'}, {value: 'es', label: 'Spanish'}]} />
                </SettingsBlock>
            </Container>
        </Body>
    )
};