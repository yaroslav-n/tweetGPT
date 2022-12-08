import { getCookie } from "../utils/get_cookie";

const baseUrl = 'https://twitter.com/i/api/2';
const bearerToken = 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA'; // same for everyone


type RequestProps = {
    query: Record<string, string>;
    body?: string;
}

export class TwitterClient {
 static async getTrending(): Promise<string[]> {
    const response = await this.sendRequest('/guide.json', {
        query: {
            include_profile_interstitial_type: "1",
            include_blocking: "1",
            include_blocked_by: "1",
            include_followed_by: "1",
            include_want_retweets: "1",
            include_mute_edge: "1",
            include_can_dm: "1",
            include_can_media_tag: "1",
            include_ext_has_nft_avatar: "1",
            include_ext_is_blue_verified: "1",
            skip_status: "1",
            cards_platform: "Web-12",
            include_cards: "1",
            include_ext_alt_text: "true",
            include_ext_limited_action_results: "false",
            include_quote_count: "true",
            include_reply_count: "1",
            tweet_mode: "extended",
            include_ext_collab_control: "true",
            include_entities: "true",
            include_user_entities: "true",
            include_ext_media_color: "true",
            include_ext_media_availability: "true",
            include_ext_sensitive_media_warning: "true",
            include_ext_trusted_friends_metadata: "true",
            send_error_codes: "true",
            simple_quoted_tweet: "true",
            count: "20",
            display_location: "web_sidebar",
            include_page_configuration: "false",
            entity_tokens: "false",
            ext: "mediaStats,highlightedLabel,hasNftAvatar,voiceInfo,enrichments,superFollowMetadata,unmentionInfo,editControl,collab_control,vibe",
        }
    }).catch(() => null);

    if (!response) {
        return []
    }

    let json: any = {}; // trust me bro

    try {
        json = await response.json();
    } catch (e) {
        return [];
    }

    const instructions = json.timeline.instructions;
    const entries = instructions.find((i: any) => !!i.addEntries);

    if (!entries) {
        return [];
    }

    const topicEntries = entries.addEntries.entries.find((e: any) => {
        return e.content?.timelineModule?.clientEventInfo?.component === 'unified_events'
    });

    if (!topicEntries) {
        return [];
    }

    const items = topicEntries.content.timelineModule.items
        .map((i: any) => i.item.content?.trend?.name)
        .filter((i: string | undefined) => !!i);

    return items;
 }

 static async sendRequest(relativeUrl: string, props: RequestProps) {
        const csrfToken = getCookie("ct0");

        const requestUrl = new URL(baseUrl + relativeUrl);
        for(const qid in Object.keys(props.query)) {
            requestUrl.searchParams.set(qid, props.query[qid]);
        }

        const init: RequestInit = {
            method: 'GET',
            headers: {
                authorization: `Bearer ${bearerToken}`,
                'x-csrf-token': csrfToken,
                'x-twitter-active-user': 'yes',
                'x-twitter-auth-type': 'OAuth2Session',
                'x-twitter-client-language': 'en'
            }
        };

        if (props.body) {
            init.method = 'POST';
            init.body = props.body;
        }

        return fetch(requestUrl.toString(), init);
    }
}